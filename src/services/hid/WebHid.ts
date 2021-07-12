import {
  ICommand,
  IConnectParams,
  IKeyboard,
  IHid,
  IDeviceInformation,
  IResult,
  IConnectResult,
  IConnectionEventHandler,
  IFetchKeymapResult,
  IFetchLayerCountResult,
  IKeymap,
  IFetchBrightnessResult,
  IFetchBacklightEffectResult,
  IFetchRGBLightColorResult,
  IFetchRGBLightEffectSpeedResult,
  IFetchRGBLightEffectResult,
  IFetchSwitchMatrixStateResult,
  IFetchLayoutOptionsResult,
} from './Hid';
import { KeycodeList } from './KeycodeList';
import {
  BleMicroProStoreKeymapPersistentlyCommand,
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapReadBufferCommand,
  DynamicKeymapResetCommand,
  DynamicKeymapSetKeycodeCommand,
  GetLayoutOptionsCommand,
  IDynamicKeymapReadBufferResponse,
  LightingGetValueCommand,
  LightingSaveCommand,
  LightingSetValueCommand,
  SetLayoutOptionsCommand,
  SwitchMatrixStateCommand,
} from './Commands';
import {
  IKeycodeCompositionFactory,
  KeycodeCompositionFactory,
} from './Composition';
import { outputUint8Array } from '../../utils/ArrayUtils';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';

export class Keyboard implements IKeyboard {
  private readonly hid: IHid;
  private readonly device: HIDDevice;
  private commandQueue: ICommand[];

  constructor(hid: IHid, device: HIDDevice) {
    this.hid = hid;
    this.commandQueue = [];
    this.device = device;
  }

  getHid(): IHid {
    return this.hid;
  }

  getInformation(): IDeviceInformation {
    return {
      vendorId: this.device.vendorId!,
      productId: this.device.productId!,
      productName: this.device.productName!,
    };
  }

  isOpened(): boolean {
    return this.device.opened!;
  }

  async close(): Promise<void> {
    try {
      this.getDevice().removeEventListener(
        'inputreport',
        this.handleInputReport
      );
      await this.device.close();
    } catch (error) {
      console.log(error);
      // Ignore.
    }
  }

  getDevice(): HIDDevice {
    return this.device;
  }

  isSameDevice(target: IKeyboard): boolean {
    if (target === null) {
      return false;
    }
    return this.device === target.getDevice();
  }

  async open(): Promise<IResult> {
    if (this.isOpened()) {
      return {
        success: false,
        error: 'The keyboard already connected and opened.',
      };
    }
    const device = this.getDevice();
    try {
      await device.open();
      device.addEventListener('inputreport', this.handleInputReport);
    } catch (error) {
      return {
        success: false,
        error: 'The device cannot be opened.',
        cause: error,
      };
    }
    return {
      success: true,
    };
  }

  handleInputReport = async (e: any): Promise<void> => {
    outputUint8Array('Received data', new Uint8Array(e.data.buffer));
    if (this.commandQueue.length > 0) {
      const command = this.commandQueue[0];
      if (command!.canHandleInputReport(e)) {
        await command!.handleInputReport(e);
        this.commandQueue.shift();
        if (this.commandQueue.length > 0) {
          await this.commandQueue[0].sendReport(this.getDevice());
          return;
        }
      } else {
        // FIXME: 2021/01/16 For Windows:
        // If command.canHandleInputReport === false, Windows Chrome might return duplicate response.
        // The response should be ignored, and should wait a next response.
        console.warn('Duplicate response was handled. Ignore.');
      }
    } else {
      console.log(
        'Bytes received but the command queue is empty. Close the keyboard.'
      );
      this.hid.close(this);
    }
  };

  async enqueue(command: ICommand): Promise<IResult> {
    if (this.isOpened()) {
      this.commandQueue.push(command);
      if (this.commandQueue.length === 1) {
        await this.commandQueue[0].sendReport(this.getDevice());
      }
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: 'Not connected or opened.',
      };
    }
  }

  async fetchKeymaps(
    layer: number,
    rowCount: number,
    columnCount: number,
    labelLang: KeyboardLabelLang
  ): Promise<IFetchKeymapResult> {
    const totalSize = rowCount * columnCount * 2;
    let offset = layer * totalSize;
    const commandResults: Promise<IDynamicKeymapReadBufferResponse>[] = [];
    let remainingSize = totalSize;
    do {
      let size: number;
      if (28 < remainingSize) {
        size = 28;
        remainingSize = remainingSize - 28;
      } else {
        size = remainingSize;
        remainingSize = 0;
      }
      commandResults.push(
        new Promise<IDynamicKeymapReadBufferResponse>((resolve, reject) => {
          const command = new DynamicKeymapReadBufferCommand(
            {
              offset,
              size,
            },
            async (result) => {
              if (result.success) {
                resolve(result.response!);
              } else {
                console.log(result.cause!);
                reject(result.error!);
              }
            }
          );
          return this.enqueue(command);
        })
      );
      offset = offset + 28;
    } while (remainingSize !== 0);
    try {
      const responses = await Promise.all<IDynamicKeymapReadBufferResponse>(
        commandResults
      );
      let row = 0;
      let column = 0;
      const keymapMap: { [pos: string]: IKeymap } = {};
      responses.forEach((response) => {
        if (rowCount === row) {
          return;
        }
        const buffer = response.buffer;
        if (buffer.length % 2 !== 0) {
          throw new Error(`Invalid buffer size: ${buffer.length}`);
        }
        for (let i = 0; i < buffer.length; i += 2) {
          const code = (buffer[i] << 8) | buffer[i + 1];
          const keymap = KeycodeList.getKeymap(code, labelLang);
          keymapMap[`${row},${column}`] = keymap;
          column = column + 1;
          if (columnCount === column) {
            column = 0;
            row = row + 1;
          }
          if (rowCount === row) {
            break;
          }
        }
      });
      return {
        success: true,
        keymap: keymapMap,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching keymaps failed.',
        cause: error,
      };
    }
  }

  fetchLayerCount(): Promise<IFetchLayerCountResult> {
    return new Promise<IFetchLayerCountResult>((resolve) => {
      const command = new DynamicKeymapGetLayerCountCommand(
        {},
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              layerCount: result.response!.value,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  updateKeymap(
    layer: number,
    row: number,
    column: number,
    code: number
  ): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapSetKeycodeCommand(
        {
          layer,
          row,
          column,
          code,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchBacklightBrightness(): Promise<IFetchBrightnessResult> {
    return new Promise<IFetchBrightnessResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkBacklightBrightness',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              brightness: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchBacklightEffect(): Promise<IFetchBacklightEffectResult> {
    return new Promise<IFetchBacklightEffectResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkBacklightEffect',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              isBreathing: result.response!.value1 !== 0,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightBrightness(): Promise<IFetchBrightnessResult> {
    return new Promise<IFetchBrightnessResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkRgblightBrightness',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              brightness: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightColor(): Promise<IFetchRGBLightColorResult> {
    return new Promise<IFetchRGBLightColorResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkRgblightColor',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              hue: result.response!.value1,
              sat: result.response!.value2,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightEffect(): Promise<IFetchRGBLightEffectResult> {
    return new Promise<IFetchRGBLightEffectResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkRgblightEffect',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              mode: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchRGBLightEffectSpeed(): Promise<IFetchRGBLightEffectSpeedResult> {
    return new Promise<IFetchRGBLightEffectSpeedResult>((resolve) => {
      const command = new LightingGetValueCommand(
        {
          lightingValue: 'qmkRgblightEffectSpeed',
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              speed: result.response!.value1,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  private sendUpdateAndSaveLightingSettingCommands(
    updateCommand: Promise<IResult>
  ): Promise<IResult> {
    return updateCommand.then((result) => {
      return new Promise<IResult>((resolve) => {
        if (!result.success) {
          resolve(result);
          return;
        }
        const saveCommand = new LightingSaveCommand({}, async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        });
        return this.enqueue(saveCommand);
      });
    });
  }

  updateBacklightBrightness(brightness: number): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new LightingSetValueCommand(
          {
            lightingValue: 'qmkBacklightBrightness',
            value1: brightness,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  updateBacklightEffect(isBreathing: boolean): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new LightingSetValueCommand(
          {
            lightingValue: 'qmkBacklightEffect',
            value1: isBreathing ? 1 : 0,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  updateRGBLightBrightness(brightness: number): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new LightingSetValueCommand(
          {
            lightingValue: 'qmkRgblightBrightness',
            value1: brightness,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  updateRGBLightColor(hue: number, sat: number): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new LightingSetValueCommand(
          {
            lightingValue: 'qmkRgblightColor',
            value1: hue,
            value2: sat,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  async updateRGBLightEffect(mode: number): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const updateCommand = new LightingSetValueCommand(
          {
            lightingValue: 'qmkRgblightEffect',
            value1: mode,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(updateCommand);
      })
    );
  }

  updateRGBLightEffectSpeed(speed: number): Promise<IResult> {
    return this.sendUpdateAndSaveLightingSettingCommands(
      new Promise<IResult>((resolve) => {
        const command = new LightingSetValueCommand(
          {
            lightingValue: 'qmkRgblightEffectSpeed',
            value1: speed,
            value2: 0,
          },
          async (result) => {
            if (result.success) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: result.error,
                cause: result.cause,
              });
            }
          }
        );
        return this.enqueue(command);
      })
    );
  }

  resetDynamicKeymap(): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapResetCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  storeKeymapPersistentlyForBleMicroPro(): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new BleMicroProStoreKeymapPersistentlyCommand(
        {},
        async (result) => {
          if (result.success) {
            if (result.response!.resultCode === 0x00) {
              resolve({
                success: true,
              });
            } else {
              resolve({
                success: false,
                error: `Storing keymap persistently for BLE Micro Pro failed: ${
                  result.response!.resultCode
                }`,
              });
            }
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  fetchSwitchMatrixState(): Promise<IResult> {
    return new Promise<IFetchSwitchMatrixStateResult>((resolve) => {
      const command = new SwitchMatrixStateCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
            state: result.response!.state,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  fetchLayoutOptions(): Promise<IFetchLayoutOptionsResult> {
    return new Promise<IFetchLayoutOptionsResult>((resolve) => {
      const command = new GetLayoutOptionsCommand({}, async (result) => {
        if (result.success) {
          resolve({
            success: true,
            value: result.response!.value,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }

  updateLayoutOptions(value: number): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new SetLayoutOptionsCommand({ value }, async (result) => {
        if (result.success) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: result.error,
            cause: result.cause,
          });
        }
      });
      return this.enqueue(command);
    });
  }
}

export interface ICommandRequest {}

export interface ICommandResponse {}

export interface ICommandResult<T> {
  success: boolean;
  response?: T;
  error?: string;
  cause?: any;
}

export interface ICommandResponseHandler<T extends ICommandResponse> {
  // eslint-disable-next-line
  (result: ICommandResult<T>): Promise<void>;
}

export class WebHid implements IHid {
  private handler?: IConnectionEventHandler;

  async detectKeyboards(): Promise<IKeyboard[]> {
    const devices = await navigator.hid.getDevices();
    return devices
      .filter((device: HIDDevice) => {
        const collectionInfo = device.collections![0];
        return (
          collectionInfo &&
          collectionInfo.usage === 0x61 &&
          collectionInfo.usagePage === 0xff60
        );
      })
      .map((device: HIDDevice) => {
        return new Keyboard(this, device);
      });
  }

  async connect(connectParams?: IConnectParams): Promise<IConnectResult> {
    let device;
    try {
      let devices;
      if (connectParams) {
        devices = await navigator.hid.requestDevice({
          filters: [
            {
              vendorId: connectParams.vendorId,
              productId: connectParams.productId,
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      } else {
        devices = await navigator.hid.requestDevice({
          filters: [
            {
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      }
      device = devices[0];
    } catch (error) {
      return {
        success: false,
        error: 'The connection failed.',
        cause: error,
      };
    }
    if (device === undefined) {
      return {
        success: false,
        error: 'No device was selected.',
      };
    }
    return {
      success: true,
      keyboard: new Keyboard(this, device),
    };
  }

  checkViaSupportedDevice(device: any): boolean {
    const collection = device.collections[0];
    if (collection) {
      return collection.usage === 0x61 && collection.usagePage === 0xff60;
    } else {
      return false;
    }
  }

  setConnectionEventHandler(handler: IConnectionEventHandler): void {
    (navigator as any).hid.addEventListener('connect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.connect(new Keyboard(this, e.device));
      }
    });
    (navigator as any).hid.addEventListener('disconnect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.disconnect(new Keyboard(this, e.device));
      }
    });
    this.handler = handler;
  }

  close(keyboard: IKeyboard): void {
    this.handler!.close(keyboard);
  }

  createKeycodeCompositionFactory(code: number): IKeycodeCompositionFactory {
    return new KeycodeCompositionFactory(code, 'en-us');
  }
}
