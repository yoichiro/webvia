/* eslint-disable no-unused-vars */
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { MOD_LEFT } from './Composition';
import {
  ICommand,
  IConnectionEventHandler,
  IConnectParams,
  IFetchLayoutOptionsResult,
  IHid,
  IKeyboard,
  IResult,
} from './Hid';

export const IDeviceInformationMock = {
  vendorId: 777,
  productId: 1,
  productName: 'Keybooard Mock',
};

export const IHidMock: IHid = {
  detectKeyboards: () => {
    return new Promise((resolve) => {
      const kbd: IKeyboard = {} as IKeyboard;
      resolve([kbd]);
    });
  },
  setConnectionEventHandler: (handler: IConnectionEventHandler) => {},
  connect: (connectParams?: IConnectParams) => {
    return new Promise((resolve) => {
      const kbd: IKeyboard = {} as IKeyboard;
      resolve({ success: true, keyboard: kbd });
    });
  },
  close: () => {},
  createKeycodeCompositionFactory: (code: number) => {
    return {} as any;
  },
};

export const mockIKeyboad: IKeyboard = {
  getDevice: () => {
    return new HIDDevice();
  },
  getHid: () => {
    return IHidMock;
  },
  getInformation: () => {
    return IDeviceInformationMock;
  },
  open: () => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  isOpened: () => {
    return true;
  },
  isSameDevice: (target) => {
    return true;
  },
  enqueue: (command: ICommand) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  close: () => {
    return new Promise((resolve) => {
      resolve();
    });
  },
  fetchLayerCount: () => {
    return new Promise((resolve) => {
      resolve({ success: true, layerCount: 4 });
    });
  },
  fetchKeymaps: (
    layer: number,
    rowCount: number,
    columnCount: number,
    labelLang: KeyboardLabelLang
  ) => {
    return new Promise((resolve) => {
      resolve({
        success: true,
        keymap: {
          '0,0': {
            isAny: false,
            code: 0,
            kinds: [],
            direction: MOD_LEFT,
            modifiers: [],
            keycodeInfo: {
              code: 0,
              label: 'Mock(0,0)',
              name: {
                short: 'KC_MOCK',
                long: 'KC_MOCK',
              },
            },
          },
        },
      });
    });
  },
  updateKeymap: (ayer: number, row: number, column: number, code: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  fetchBacklightBrightness: () => {
    return new Promise((resolve) => {
      resolve({ success: true, brightness: 100 });
    });
  },
  fetchBacklightEffect: () => {
    return new Promise((resolve) => {
      resolve({ success: true, isBreathing: true });
    });
  },
  fetchRGBLightBrightness: () => {
    return new Promise((resolve) => {
      resolve({ success: true, brightness: 100 });
    });
  },
  fetchRGBLightEffect: () => {
    return new Promise((resolve) => {
      resolve({ success: true, mode: 3 });
    });
  },
  fetchRGBLightEffectSpeed: () => {
    return new Promise((resolve) => {
      resolve({ success: true, speed: 1 });
    });
  },
  fetchRGBLightColor: () => {
    return new Promise((resolve) => {
      resolve({ success: true, hue: 200, sat: 111 });
    });
  },
  updateBacklightBrightness: (brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateBacklightEffect: (isBreathing: boolean) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightBrightness: (brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffect: (mode: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffectSpeed: (speed: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightColor: (hue: number, sat: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  resetDynamicKeymap: () => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  storeKeymapPersistentlyForBleMicroPro: (): Promise<IResult> => {
    return new Promise<IResult>((resolve) => {
      resolve({ success: true });
    });
  },
  fetchSwitchMatrixState: () => {
    return new Promise<IResult>((resolve) => {
      resolve({ success: true });
    });
  },
  fetchLayoutOptions: () => {
    return new Promise<IFetchLayoutOptionsResult>((resolve) => {
      resolve({ success: true, value: 0 });
    });
  },
  updateLayoutOptions: (value: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
};
