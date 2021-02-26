/* eslint-disable no-undef */
import { WebHid } from '../WebHid';
import React, { useEffect, useState } from 'react';
import './Hid.scss';
import {
  DynamicKeymapGetKeycodeCommand,
  DynamicKeymapMacroGetBufferCommand,
  DynamicKeymapReadBufferCommand,
  LightingGetValueCommand,
  LightingSetValueCommand,
} from '../Commands';
import { IKeyboard } from '../Hid';
import KeycodeArray from '../assets/keycodes.json';

const Hid = () => {
  const [webHid] = useState<WebHid>(new WebHid());
  const [keyboard, setKeyboard] = useState<IKeyboard | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [vendorId, setVendorId] = useState<string>('5954');
  const [productId, setProductId] = useState<string>('1');
  const [useFilter, setUseFilter] = useState<boolean>(false);
  const [connectedKeyboards, setConnectedKeyboards] = useState<IKeyboard[]>([]);
  const [selectedKeyboardValue, setSelectedKeyboardValue] = useState<number>(0);
  const [layerCount, setLayerCount] = useState<number>(0);
  const [layer, setLayer] = useState<number>(0);
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(0);
  const [code, setCode] = useState<number>(0);
  const [layer2, setLayer2] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(0);
  const [bufferOffset, setBufferOffset] = useState<number>(0);
  const [bufferSize, setBufferSize] = useState<number>(28);
  const [lightingKind, setLightingKind] = useState<number>(0);
  const [macroOffset, setMacroOffset] = useState<number>(0);
  const [macroSize, setMacroSize] = useState<number>(0);

  useEffect(() => {
    webHid
      .detectKeyboards()
      .then((keyboards) => setConnectedKeyboards(keyboards));
  }, [webHid]);

  useEffect(() => {
    webHid.setConnectionEventHandler({
      connect: (connectedKeyboard) => {
        const newConnectedKeyboards = [...connectedKeyboards];
        newConnectedKeyboards.push(connectedKeyboard);
        setConnectedKeyboards(newConnectedKeyboards);
      },
      disconnect: (disconnectedKeyboard) => {
        const newConnectedKeyboards = connectedKeyboards.filter(
          (x) => x !== disconnectedKeyboard
        );
        setConnectedKeyboards(newConnectedKeyboards);
      },
      close: (keyboard: IKeyboard) => {
        console.log(keyboard);
      },
    });
  }, []);

  const handleConnectClick = async () => {
    let result;
    if (useFilter) {
      result = await webHid.connect({
        vendorId: parseInt(vendorId, 16),
        productId: parseInt(productId, 16),
      });
    } else {
      result = await webHid.connect();
    }
    if (result.success) {
      await result.keyboard!.open();
      setKeyboard(result.keyboard);
      setProductName(result.keyboard!.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleCloseClick = async () => {
    if (keyboard) {
      await keyboard.close();
      setKeyboard(undefined);
    }
    setProductName('');
    setMessage('');
  };

  const handleDynamicKeymapGetLayerCount = async () => {
    if (keyboard) {
      const result = await keyboard.fetchLayerCount();
      if (result.success) {
        setLayerCount(result.layerCount!);
      } else {
        setMessage(result.error!);
        console.log(result.cause);
      }
    } else {
      setMessage('No any keyboards opened.');
    }
  };

  const handleVendorIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendorId(event.target.value);
  };

  const handleProductIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductId(event.target.value);
  };

  const handleUseFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseFilter(event.target.checked);
  };

  const handleGetConnectedKeyboardsClick = async () => {
    const keyboards = await webHid.detectKeyboards();
    setConnectedKeyboards(keyboards);
    setSelectedKeyboardValue(0);
  };

  const handleSelectedKeyboardValue = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedKeyboardValue(Number(event.target.value));
  };

  const handleOpenClick = async () => {
    const keyboard = connectedKeyboards[selectedKeyboardValue];
    const result = await keyboard.open();
    if (result.success) {
      setKeyboard(keyboard);
      setProductName(keyboard.getInformation().productName);
    } else {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleLayerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLayer(Number(event.target.value));
  };

  const handleLayer2Change = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLayer2(Number(event.target.value));
  };

  const handleRowChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRow(Number(event.target.value));
  };

  const handleRowCountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowCount(Number(event.target.value));
  };

  const handleColumnChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColumn(Number(event.target.value));
  };

  const handleColumnCountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setColumnCount(Number(event.target.value));
  };

  const handleCodeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCode(Number(event.target.value));
  };

  const handleBufferOffsetChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBufferOffset(Number(event.target.value));
  };

  const handleBufferSizeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBufferSize(Number(event.target.value));
  };

  const handleFetchKeymapClick = async () => {
    if (keyboard) {
      const fetchKeymapResult = await keyboard.fetchKeymaps(
        layer2,
        rowCount,
        columnCount
      );
      if (fetchKeymapResult.success) {
        console.log(fetchKeymapResult.keymap);
      } else {
        setMessage(fetchKeymapResult.error!);
        console.log(fetchKeymapResult.cause);
      }
    } else {
      setMessage('No any keyboard opened.');
    }
  };

  const handleDynamicKeymapGetKeycodeClick = async () => {
    const command = new DynamicKeymapGetKeycodeCommand(
      {
        layer,
        row,
        column,
      },
      async (result) => {
        if (result.success) {
          console.log(result.response!.code);
          setCode(result.response!.code);
        } else {
          setMessage(result.error!);
          console.log(result.cause);
        }
      }
    );
    await keyboard!.enqueue(command);
  };

  const handleDynamicKeymapSetKeycodeClick = async () => {
    const result = await keyboard!.updateKeymap(layer, row, column, code);
    if (!result.success) {
      setMessage(result.error!);
      console.log(result.cause);
    }
  };

  const handleReadBufferClick = async () => {
    const command = new DynamicKeymapReadBufferCommand(
      {
        offset: bufferOffset,
        size: bufferSize,
      },
      async (result) => {
        console.log(result);
      }
    );
    await keyboard!.enqueue(command);
  };

  const handleLightingKindChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(event.target.value);
    const command = new LightingSetValueCommand(
      { lightingValue: 'qmkRgblightEffect', value1: value, value2: 0 },
      async (result) => {
        console.log(result);
        setLightingKind(result.response!.value1);
      }
    );
    await keyboard!.enqueue(command);
  };

  const handleGetLightingKindClick = async () => {
    const command = new LightingGetValueCommand(
      { lightingValue: 'qmkRgblightEffect' },
      async (result) => {
        console.log(result);
        setLightingKind(result.response!.value1);
      }
    );
    await keyboard!.enqueue(command);
  };

  const handleGetLightingTestClick = async () => {
    console.log(await keyboard!.fetchRGBLightEffectSpeed());
  };

  const handleMacroGetCountClick = async () => {
    console.log(await keyboard!.getMacroCount());
  };

  const handleMacroGetBufferSizeClick = async () => {
    console.log(await keyboard!.getMacroBufferSize());
  };

  const handleMacroOffsetChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMacroOffset(Number(event.target.value));
  };

  const handleMacroSizeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMacroSize(Number(event.target.value));
  };

  const handleMacroGetBufferClick = async () => {
    const command = new DynamicKeymapMacroGetBufferCommand(
      {
        offset: macroOffset,
        size: macroSize,
      },
      async (result) => {
        console.log(result);
      }
    );
    await keyboard!.enqueue(command);
  };

  return (
    <div className="hid">
      <h1>WebHid Test</h1>
      <div className="box">
        <button onClick={handleGetConnectedKeyboardsClick}>
          Get connected keyboards
        </button>
        <select
          value={selectedKeyboardValue}
          onChange={handleSelectedKeyboardValue}
        >
          {connectedKeyboards.map((k, i) => {
            return (
              <option key={i} value={i}>
                {k.getInformation().productName}
              </option>
            );
          })}
        </select>
        <button onClick={handleOpenClick}>Open</button>
      </div>
      <div className="box">
        <input
          type="checkbox"
          id="useFilter"
          checked={useFilter}
          onChange={handleUseFilterChange}
        />
        <label htmlFor="useFilter">Use filter</label>
        <label htmlFor="vendorId">Vendor ID: </label>
        0x
        <input
          type="text"
          id="vendorId"
          value={vendorId}
          onChange={handleVendorIdChange}
        />
        <label htmlFor="productId">Product ID: </label>
        0x
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={handleProductIdChange}
        />
        <button onClick={handleConnectClick}>Connect and open</button>
      </div>
      <div className="box">
        <span>Product Name: {productName}</span>
        <button onClick={handleCloseClick}>Close</button>
      </div>
      <div className="box">
        <button onClick={handleDynamicKeymapGetLayerCount}>
          Get layer count
        </button>
        Layers: {layerCount}
      </div>
      <div className="box">
        <label htmlFor="layer">Layer</label>
        <input
          type="number"
          id="layer"
          min={0}
          max={Math.max(layerCount - 1, 0)}
          value={layer}
          onChange={handleLayerChange}
        />
        <label htmlFor="row">Row</label>
        <input
          type="number"
          id="row"
          min={0}
          value={row}
          onChange={handleRowChange}
        />
        <label htmlFor="column">Column</label>
        <input
          type="number"
          id="column"
          min={0}
          value={column}
          onChange={handleColumnChange}
        />
        <select value={code} onChange={handleCodeChange}>
          {KeycodeArray.map((keycode) => {
            return (
              <option key={keycode.code} value={keycode.code}>
                {keycode.name.long}
              </option>
            );
          })}
        </select>
        <button onClick={handleDynamicKeymapGetKeycodeClick}>
          Get keycode
        </button>
        <button onClick={handleDynamicKeymapSetKeycodeClick}>
          Set keycode
        </button>
      </div>
      <div className="box">
        <label htmlFor="layer2">Layer</label>
        <input
          type="number"
          id="layer2"
          min={0}
          max={layerCount}
          value={layer2}
          onChange={handleLayer2Change}
        />
        <label htmlFor="rowCount">Row count</label>
        <input
          type="number"
          id="rowCount"
          min={0}
          value={rowCount}
          onChange={handleRowCountChange}
        />
        <label htmlFor="columnCount">Column count</label>
        <input
          type="number"
          id="columnCount"
          min={0}
          value={columnCount}
          onChange={handleColumnCountChange}
        />
        <button onClick={handleFetchKeymapClick}>Fetch keymap</button>
      </div>
      <div className="box">
        <label htmlFor="bufferOffset">Offset</label>
        <input
          type="number"
          id="bufferOffset"
          min={0}
          value={bufferOffset}
          onChange={handleBufferOffsetChange}
        />
        <label htmlFor="bufferSize">Size</label>
        <input
          type="number"
          id="bufferSize"
          min={0}
          value={bufferSize}
          onChange={handleBufferSizeChange}
        />
        <button onClick={handleReadBufferClick}>Read buffer</button>
      </div>
      <div className="box">
        <label htmlFor="lightingKind">Lighting kind</label>
        <select
          value={lightingKind}
          onChange={handleLightingKindChange}
          className="uk-select"
        >
          <option value={0}>OFF</option>
          <option value={1}>Solid color</option>
          <option value={2}>Solid color breathing 1</option>
          <option value={3}>Solid color breathing 2</option>
          <option value={4}>Solid color breathing 3</option>
          <option value={5}>Solid color breathing 4</option>
          <option value={6}>Cycling rainbow 1</option>
          <option value={7}>Cycling rainbow 2</option>
          <option value={8}>Cycling rainbow 3</option>
          <option value={9}>Swirling rainbow 1</option>
          <option value={10}>Swirling rainbow 2</option>
          <option value={11}>Swirling rainbow 3</option>
          <option value={12}>Swirling rainbow 4</option>
          <option value={13}>Swirling rainbow 5</option>
          <option value={14}>Swirling rainbow 6</option>
          <option value={15}>Snake 1</option>
          <option value={16}>Snake 2</option>
          <option value={17}>Snake 3</option>
          <option value={18}>Snake 4</option>
          <option value={19}>Snake 5</option>
          <option value={20}>Snake 6</option>
          <option value={21}>Knight 1</option>
          <option value={22}>Knight 2</option>
          <option value={23}>Knight 3</option>
          <option value={24}>Christmas</option>
          <option value={25}>Static gradient 1</option>
          <option value={26}>Static gradient 2</option>
          <option value={27}>Static gradient 3</option>
          <option value={28}>Static gradient 4</option>
          <option value={29}>Static gradient 5</option>
          <option value={30}>Static gradient 6</option>
          <option value={31}>Static gradient 7</option>
          <option value={32}>Static gradient 8</option>
          <option value={33}>Static gradient 9</option>
          <option value={34}>Static gradient 10</option>
          <option value={35}>RGB Test</option>
          <option value={36}>Alternating</option>
          <option value={37}>Twinkle 1</option>
          <option value={38}>Twinkle 2</option>
          <option value={39}>Twinkle 3</option>
          <option value={40}>Twinkle 4</option>
          <option value={41}>Twinkle 5</option>
          <option value={42}>Twinkle 6</option>
        </select>
        <button onClick={handleGetLightingKindClick}>Read Lighting kind</button>
        <button onClick={handleGetLightingTestClick}>Test</button>
      </div>
      <div className="box">
        <button onClick={handleMacroGetCountClick}>Macro Get Count</button>
        <button onClick={handleMacroGetBufferSizeClick}>
          Macro Get Buffer Size
        </button>
        <label htmlFor="macroOffset">Offset</label>
        <input
          type="number"
          id="macroOffset"
          min={0}
          value={macroOffset}
          onChange={handleMacroOffsetChange}
        />
        <label htmlFor="macroSize">Size</label>
        <input
          type="number"
          id="macroSize"
          min={0}
          value={macroSize}
          onChange={handleMacroSizeChange}
        />
        <button onClick={handleMacroGetBufferClick}>Get Buffer</button>
      </div>
      <div className="box">
        <label htmlFor="Test">Test</label>
        <input type="text" style={{ width: '300px' }} />
      </div>
      <div>{message}</div>
    </div>
  );
};

export default Hid;
