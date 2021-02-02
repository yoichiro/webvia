import {
  BasicComposition,
  DefLayerComposition,
  FunctionComposition,
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
  KeycodeCompositionKind,
  LayerModComposition,
  LayerTapComposition,
  LayerTapToggleComposition,
  LooseKeycodeComposition,
  MacroComposition,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
  ModDirection,
  ModsComposition,
  ModTapComposition,
  MomentaryComposition,
  OneShotLayerComposition,
  OneShotModComposition,
  OP_SH_OFF,
  OP_SH_OFF_ON,
  OP_SH_ON,
  OP_SH_ON_OFF,
  OP_SH_ONESHOT,
  OP_SH_TAP_TOGGLE,
  OP_SH_TOGGLE,
  SwapHandsComposition,
  TapDanceComposition,
  ToComposition,
  ToggleLayerComposition,
  UnicodeComposition,
} from './Composition';
import { IHid, IKeymap } from './Hid';
import * as sinon from 'sinon';

const EXPECT_BASIC_LIST = [0b0000_0000_0000_0000, 0b0000_0000_1111_1111];
const EXPECT_MODS_LIST = [0b0000_0001_0000_0000, 0b0001_1111_1111_1111];
const EXPECT_FUNCTION_LIST = [0b0010_0000_0000_0000, 0b0010_1111_1111_1111];
const EXPECT_MACRO_LIST = [0b0011_0000_0000_0000, 0b0011_1111_1111_1111];
const EXPECT_LAYER_TAP_LIST = [0b0100_0000_0000_0000, 0b0100_1111_1111_1111];
const EXPECT_TO_LIST = [0b0101_0000_0000_0000, 0b0101_0000_1111_1111];
const EXPECT_MOMENTARY_LIST = [0b0101_0001_0000_0000, 0b0101_0001_1111_1111];
const EXPECT_DEF_LAYER_LIST = [0b0101_0010_0000_0000, 0b0101_0010_1111_1111];
const EXPECT_TOGGLE_LAYER_LIST = [0b0101_0011_0000_0000, 0b0101_0011_1111_1111];
const EXPECT_ONE_SHOT_LAYER_LIST = [
  0b0101_0100_0000_0000,
  0b0101_0100_1111_1111,
];
const EXPECT_ONE_SHOT_MOD_LIST = [0b0101_0101_0000_0000, 0b0101_0101_1111_1111];
const EXPECT_TAP_DANCE_LIST = [0b0101_0111_0000_0000, 0b0101_0111_1111_1111];
const EXPECT_LAYER_TAP_TOGGLE_LIST = [
  0b0101_1000_0000_0000,
  0b0101_1000_1111_1111,
];
const EXPECT_LAYER_MOD_LIST = [0b0101_1001_0000_0000, 0b0101_1001_1111_1111];
const EXPECT_SWAP_HANDS_LIST = [0b0101_1011_0000_0000, 0b0101_1011_1111_1111];
const EXPECT_MOD_TAP_LIST = [0b0110_0000_0000_0000, 0b0111_1111_1111_1111];
const EXPECT_UNICODE_LIST = [0b1000_0000_0000_0000, 0b1111_1111_1111_1111];
const EXPECT_LOOSE_KEYCODE_LIST = [
  0b0101_1100_0000_0000,
  0b0101_1111_1111_1111,
];
const EXPECT_UNKNOWN_LIST = [0b0101_0110_0000_0000_0000];

describe('Composition', () => {
  describe('BasicComposition', () => {
    describe('getCode', () => {
      let subject = new BasicComposition({
        code: 0b0000_0100,
        isAny: false,
        keycodeInfo: {
          code: 0b0000_0100,
          name: {
            long: 'KC_A',
            short: 'KC_A',
          },
          label: 'A',
        },
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0100);
      subject = new BasicComposition({
        code: 0b0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
      subject = new BasicComposition({
        code: 0b1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_1111_1111);
      subject = new BasicComposition({
        code: 0b1_0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
    });
  });

  describe('ModsComposition', () => {
    describe('getCode', () => {
      let subject = new ModsComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0100);
      subject = new ModsComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
      subject = new ModsComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
      subject = new ModsComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_1111_1111);
      subject = new ModsComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_1111_1111);
      subject = new ModsComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
      subject = new ModsComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
    });
  });

  describe('FunctionComposition', () => {
    describe('getCode', () => {
      let subject = new FunctionComposition(0b0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0010_0000_0000_0000);
      subject = new FunctionComposition(0b1111_1111_1111);
      expect(subject.getCode()).toEqual(0b0010_1111_1111_1111);
      subject = new FunctionComposition(0b1_0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0010_0000_0000_0000);
    });
  });

  describe('MacroComposition', () => {
    describe('getCode', () => {
      let subject = new MacroComposition(0b0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0011_0000_0000_0000);
      expect(subject.isTap()).toBeFalsy();
      subject = new MacroComposition(0b1111_1111_1111);
      expect(subject.getCode()).toEqual(0b0011_1111_1111_1111);
      expect(subject.isTap()).toBeTruthy();
      subject = new MacroComposition(0b1_0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0011_0000_0000_0000);
    });
  });

  describe('LayerTapComposition', () => {
    describe('getCode', () => {
      let subject = new LayerTapComposition(2, {
        code: 0b0000_0100,
        isAny: false,
        keycodeInfo: {
          code: 0b0000_0100,
          name: {
            long: 'KC_A',
            short: 'KC_A',
          },
          label: 'A',
        },
      });
      expect(subject.getCode()).toEqual(0b0100_0010_0000_0100);
      subject = new LayerTapComposition(0, {
        code: 0b0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0100_0000_0000_0000);
      subject = new LayerTapComposition(15, {
        code: 0b1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0100_1111_1111_1111);
      subject = new LayerTapComposition(16, {
        code: 0b1_0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0100_0000_0000_0000);
    });
  });

  describe('ToComposition', () => {
    describe('getCode', () => {
      let subject = new ToComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_0000_0001_0100);
      subject = new ToComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_0000_0001_0000);
      subject = new ToComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_0000_0001_1111);
      subject = new ToComposition(0b1_0000);
      expect(subject.getCode()).toEqual(0b0101_0000_0001_0000);
    });
  });

  describe('MomentaryComposition', () => {
    describe('getCode', () => {
      let subject = new MomentaryComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_0001_0000_0100);
      subject = new MomentaryComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_0001_0000_0000);
      subject = new MomentaryComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_0001_0000_1111);
      subject = new MomentaryComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0001_0000_0000);
    });
  });

  describe('DefLayerComposition', () => {
    describe('getCode', () => {
      let subject = new DefLayerComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_0010_0000_0100);
      subject = new DefLayerComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_0010_0000_0000);
      subject = new DefLayerComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_0010_0000_1111);
      subject = new DefLayerComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0010_0000_0000);
    });
  });

  describe('ToggleLayerComposition', () => {
    describe('getCode', () => {
      let subject = new ToggleLayerComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_0011_0000_0100);
      subject = new ToggleLayerComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_0011_0000_0000);
      subject = new ToggleLayerComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_0011_0000_1111);
      subject = new ToggleLayerComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0011_0000_0000);
    });
  });

  describe('OneShotLayerComposition', () => {
    describe('getCode', () => {
      let subject = new OneShotLayerComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_0100_0000_0100);
      subject = new OneShotLayerComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_0100_0000_0000);
      subject = new OneShotLayerComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_0100_0000_1111);
      subject = new OneShotLayerComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0100_0000_0000);
    });
  });

  describe('OneShotModComposition', () => {
    describe('getCode', () => {
      let subject = new OneShotModComposition(ModDirection.right, [
        MOD_CTL,
        MOD_SFT,
        MOD_ALT,
        MOD_GUI,
      ]);
      expect(subject.getCode()).toEqual(0b0101_0101_0001_1111);
      subject = new OneShotModComposition(ModDirection.left, [
        MOD_CTL,
        MOD_SFT,
        MOD_ALT,
        MOD_GUI,
      ]);
      expect(subject.getCode()).toEqual(0b0101_0101_0000_1111);
      subject = new OneShotModComposition(ModDirection.right, []);
      expect(subject.getCode()).toEqual(0b0101_0101_0001_0000);
      subject = new OneShotModComposition(ModDirection.left, []);
      expect(subject.getCode()).toEqual(0b0101_0101_0000_0000);
    });
  });

  describe('TapDanceComposition', () => {
    describe('getCode', () => {
      let subject = new TapDanceComposition(2);
      expect(subject.getCode()).toEqual(0b0101_0111_0000_0010);
      subject = new TapDanceComposition(0b0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0111_0000_0000);
      subject = new TapDanceComposition(0b1111_1111);
      expect(subject.getCode()).toEqual(0b0101_0111_1111_1111);
      subject = new TapDanceComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_0111_0000_0000);
    });
  });

  describe('LayerTapToggleComposition', () => {
    describe('getCode', () => {
      let subject = new LayerTapToggleComposition(0b0100);
      expect(subject.getCode()).toEqual(0b0101_1000_0000_0100);
      subject = new LayerTapToggleComposition(0b0000);
      expect(subject.getCode()).toEqual(0b0101_1000_0000_0000);
      subject = new LayerTapToggleComposition(0b1111);
      expect(subject.getCode()).toEqual(0b0101_1000_0000_1111);
      subject = new LayerTapToggleComposition(0b1_0000_0000);
      expect(subject.getCode()).toEqual(0b0101_1000_0000_0000);
    });
  });

  describe('LayerModComposition', () => {
    describe('getCode', () => {
      let subject = new LayerModComposition(0b0100, [MOD_CTL, MOD_ALT]);
      expect(subject.getCode()).toEqual(0b0101_1001_0100_0101);
      subject = new LayerModComposition(0b0000, []);
      expect(subject.getCode()).toEqual(0b0101_1001_0000_0000);
      subject = new LayerModComposition(0b1111, [
        MOD_CTL,
        MOD_ALT,
        MOD_GUI,
        MOD_SFT,
      ]);
      expect(subject.getCode()).toEqual(0b0101_1001_1111_1111);
      subject = new LayerModComposition(0b1_0000_0000, []);
      expect(subject.getCode()).toEqual(0b0101_1001_0000_0000);
    });
  });

  describe('SwapHandsComposition', () => {
    describe('getCode', () => {
      let subject = new SwapHandsComposition({
        code: 0b0000_0100,
        isAny: false,
        keycodeInfo: {
          code: 0b0000_0100,
          name: {
            long: 'KC_A',
            short: 'KC_A',
          },
          label: 'A',
        },
      });
      expect(subject.getCode()).toEqual(0b0101_1011_0000_0100);
      subject = new SwapHandsComposition({
        code: 0b0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0101_1011_0000_0000);
      subject = new SwapHandsComposition(OP_SH_TOGGLE);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0000);
      subject = new SwapHandsComposition(OP_SH_TAP_TOGGLE);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0001);
      subject = new SwapHandsComposition(OP_SH_ON_OFF);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0010);
      subject = new SwapHandsComposition(OP_SH_OFF_ON);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0011);
      subject = new SwapHandsComposition(OP_SH_OFF);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0100);
      subject = new SwapHandsComposition(OP_SH_ON);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0101);
      subject = new SwapHandsComposition(OP_SH_ONESHOT);
      expect(subject.getCode()).toEqual(0b0101_1011_1111_0110);
    });
  });

  describe('ModTapComposition', () => {
    describe('getCode', () => {
      let subject = new ModTapComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        }
      );
      expect(subject.getCode()).toEqual(0b0111_1111_0000_0100);
      subject = new ModTapComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0110_1111_0000_0000);
      subject = new ModTapComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0111_1111_0000_0000);
      subject = new ModTapComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0110_1111_1111_1111);
      subject = new ModTapComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0111_1111_1111_1111);
      subject = new ModTapComposition(
        ModDirection.left,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0110_1111_0000_0000);
      subject = new ModTapComposition(
        ModDirection.right,
        [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0111_1111_0000_0000);
      subject = new ModTapComposition(ModDirection.left, [], {
        code: 0b1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0110_0000_1111_1111);
      subject = new ModTapComposition(ModDirection.right, [], {
        code: 0b1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0111_0000_1111_1111);
    });
  });

  describe('UnicodeComposition', () => {
    describe('getCode', () => {
      let subject = new UnicodeComposition(0b000_0000_0000);
      expect(subject.getCode()).toEqual(0b1000_0000_0000_0000);
      subject = new UnicodeComposition(0b111_1111_1111_1111);
      expect(subject.getCode()).toEqual(0b1111_1111_1111_1111);
      subject = new UnicodeComposition(0b1000_0000_0000_0000);
      expect(subject.getCode()).toEqual(0b1000_0000_0000_0000);
      subject = new UnicodeComposition(0b1111_1111_1111_1111);
      expect(subject.getCode()).toEqual(0b1111_1111_1111_1111);
    });
  });

  describe('LooseKeycodeComposition', () => {
    describe('getCode', () => {
      let subject = new LooseKeycodeComposition({
        code: 0b0101_1100_0000_0000,
        isAny: false,
        keycodeInfo: {
          code: 0b0101_1100_0000_0000,
          name: {
            long: 'RESET',
            short: 'RESET',
          },
          label: 'RESET',
        },
      });
      expect(subject.getCode()).toEqual(0b0101_1100_0000_0000);
      subject = new LooseKeycodeComposition({
        code: 0b0101_1111_1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0101_1111_1111_1111);
    });
  });

  describe('KeycodeCompositionFactory', () => {
    describe('createBasicComposition', () => {
      test('valid', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0100,
          hid
        );
        expect(subject.isBasic()).toBeTruthy();
        const actual = subject.createBasicComposition();
        expect(actual.getKey().code).toEqual(0b0000_0000_0000_0100);
      });

      test('not basic', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isBasic()).toBeFalsy();
        try {
          const actual = subject.createBasicComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createModsComposition', () => {
      test('valid - left', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0000_1111_0000_0100,
          hid
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - right', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0001_1111_0000_0100,
          hid
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          hid
        );
        expect(subject.isMods()).toBeFalsy();
        try {
          const actual = subject.createModsComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createFunctionComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0010_0000_0000_0100,
          hid
        );
        expect(subject.isFunction()).toBeTruthy();
        const actual = subject.createFunctionComposition();
        expect(actual.getFunctionId()).toEqual(0b0000_0000_0100);
      });

      test('not function', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isFunction()).toBeFalsy();
        try {
          const actual = subject.createFunctionComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createMacroComposition', () => {
      test('valid - not tap', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0011_0000_0000_0100,
          hid
        );
        expect(subject.isMacro()).toBeTruthy();
        const actual = subject.createMacroComposition();
        expect(actual.getMacroId()).toEqual(0b0000_0000_0100);
        expect(actual.isTap()).toBeFalsy();
      });

      test('valid - tap', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0011_1000_0000_0100,
          hid
        );
        expect(subject.isMacro()).toBeTruthy();
        const actual = subject.createMacroComposition();
        expect(actual.getMacroId()).toEqual(0b1000_0000_0100);
        expect(actual.isTap()).toBeTruthy();
      });

      test('not macro', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isMacro()).toBeFalsy();
        try {
          const actual = subject.createMacroComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createLayerTapComposition', () => {
      test('valid', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0100_0100_0000_0100,
          hid
        );
        expect(subject.isLayerTap()).toBeTruthy();
        const actual = subject.createLayerTapComposition();
        expect(actual.getKey().code).toEqual(0b0000_0000_0000_0100);
        expect(actual.getLayer()).toEqual(4);
      });

      test('not layer tap', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isLayerTap()).toBeFalsy();
        try {
          const actual = subject.createLayerTapComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createToComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0000_0001_0100,
          hid
        );
        expect(subject.isTo()).toBeTruthy();
        const actual = subject.createToComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isTo()).toBeFalsy();
        try {
          const actual = subject.createFunctionComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createMomentaryComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0001_0000_0100,
          hid
        );
        expect(subject.isMomentary()).toBeTruthy();
        const actual = subject.createMomentaryComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isMomentary()).toBeFalsy();
        try {
          const actual = subject.createMomentaryComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createDefLayerComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_0000_0100,
          hid
        );
        expect(subject.isDefLayer()).toBeTruthy();
        const actual = subject.createDefLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isDefLayer()).toBeFalsy();
        try {
          const actual = subject.createDefLayerComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createToggleLayerComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0011_0000_0100,
          hid
        );
        expect(subject.isToggleLayer()).toBeTruthy();
        const actual = subject.createToggleLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isToggleLayer()).toBeFalsy();
        try {
          const actual = subject.createToggleLayerComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createOneShotLayerComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0100_0000_0100,
          hid
        );
        expect(subject.isOneShotLayer()).toBeTruthy();
        const actual = subject.createOneShotLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isOneShotLayer()).toBeFalsy();
        try {
          const actual = subject.createOneShotLayerComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createOneShotModComposition', () => {
      test('valid - left', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0101_0001_1111,
          hid
        );
        expect(subject.isOneShotMod()).toBeTruthy();
        const actual = subject.createOneShotModComposition();
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - left', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0101_0000_1111,
          hid
        );
        expect(subject.isOneShotMod()).toBeTruthy();
        const actual = subject.createOneShotModComposition();
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          hid
        );
        expect(subject.isOneShotMod()).toBeFalsy();
        try {
          const actual = subject.createOneShotModComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createTapDanceComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_0111_0000_0100,
          hid
        );
        expect(subject.isTapDance()).toBeTruthy();
        const actual = subject.createTapDanceComposition();
        expect(actual.getNo()).toEqual(0b0000_0100);
      });

      test('not function', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isTapDance()).toBeFalsy();
        try {
          const actual = subject.createTapDanceComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createLayerTapToggleComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_1000_0000_0100,
          hid
        );
        expect(subject.isLayerTapToggle()).toBeTruthy();
        const actual = subject.createLayerTapToggleComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isLayerTapToggle()).toBeFalsy();
        try {
          const actual = subject.createLayerTapToggleComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createLayerModComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_1001_0010_0111,
          hid
        );
        expect(subject.isLayerMod()).toBeTruthy();
        const actual = subject.createLayerModComposition();
        expect(actual.getLayer()).toEqual(2);
        expect(actual.getModifiers().length).toEqual(3);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isLayerMod()).toBeFalsy();
        try {
          const actual = subject.createLayerModComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createSwapHandsComposition', () => {
      test('valid - key', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0101_1011_0000_0100,
          hid
        );
        expect(subject.isSwapHands()).toBeTruthy();
        const actual = subject.createSwapHandsComposition();
        expect(actual.isSwapHandsOption()).toBeFalsy();
        expect(actual.getKey()).not.toBeNull();
        expect(actual.getKey()!.code).toEqual(0b0000_0100);
        expect(actual.getSwapHandsOption()).toBeNull();
      });

      test('valid - swap hands option', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0101_1011_1111_0001,
          hid
        );
        expect(subject.isSwapHands()).toBeTruthy();
        const actual = subject.createSwapHandsComposition();
        expect(actual.isSwapHandsOption()).toBeTruthy();
        expect(actual.getKey()).toBeNull();
        expect(actual.getSwapHandsOption()).not.toBeNull();
        expect(actual.getSwapHandsOption()).toEqual(OP_SH_TAP_TOGGLE);
      });

      test('not to', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isLayerMod()).toBeFalsy();
        try {
          const actual = subject.createLayerModComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createModTapComposition', () => {
      test('valid - left', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0110_1111_0000_0100,
          hid
        );
        expect(subject.isModTap()).toBeTruthy();
        const actual = subject.createModTapComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - right', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0111_1111_0000_0100,
          hid
        );
        expect(subject.isModTap()).toBeTruthy();
        const actual = subject.createModTapComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          hid
        );
        expect(subject.isModTap()).toBeFalsy();
        try {
          const actual = subject.createModTapComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createUnicodeComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b1011_0000_0100_0010,
          hid
        );
        expect(subject.isUnicode()).toBeTruthy();
        const actual = subject.createUnicodeComposition();
        expect(actual.getCharCode()).toEqual(0b0011_0000_0100_0010);
      });

      test('not function', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isUnicode()).toBeFalsy();
        try {
          const actual = subject.createUnicodeComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createLooseKeycodeComposition', () => {
      test('valid', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0101_1100_0000_0000,
          isAny: false,
          keycodeInfo: {
            code: 0b0101_1100_0000_0000,
            name: {
              long: 'RESET',
              short: 'RESET',
            },
            label: 'RESET',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0101_1100_0000_0000,
          hid
        );
        expect(subject.isLooseKeycode()).toBeTruthy();
        const actual = subject.createLooseKeycodeComposition();
        expect(actual.getKey().code).toEqual(0b0101_1100_0000_0000);
      });

      test('not function', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isLooseKeycode()).toBeFalsy();
        try {
          const actual = subject.createLooseKeycodeComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('getKind', () => {
      const toEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, {} as IHid);
        expect(subject.getKind()).toEqual(expected);
      };
      const notToEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, {} as IHid);
        expect(subject.getKind()).not.toEqual(expected);
      };
      const checkKind = (
        validList: number[][],
        invalidList: number[][],
        kind: IKeycodeCompositionKind
      ) => {
        validList.forEach((list) => {
          test.each(list)(`valid as ${kind}`, (value) => toEqual(value, kind));
        });
        invalidList.forEach((list) => {
          test.each(list)(`invalid as ${kind}`, (value) =>
            notToEqual(value, kind)
          );
        });
      };
      describe('basic', () => {
        const validList = [EXPECT_BASIC_LIST];
        const invalidList = [
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.basic);
      });
      describe('mods', () => {
        const validList = [EXPECT_MODS_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.mods);
      });
      describe('function', () => {
        const validList = [EXPECT_FUNCTION_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.function);
      });
      describe('macro', () => {
        const validList = [EXPECT_MACRO_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.macro);
      });
      describe('layer tap', () => {
        const validList = [EXPECT_LAYER_TAP_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.layer_tap);
      });
      describe('to', () => {
        const validList = [EXPECT_TO_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.to);
      });
      describe('momentary', () => {
        const validList = [EXPECT_MOMENTARY_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.momentary);
      });
      describe('def layer', () => {
        const validList = [EXPECT_DEF_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.def_layer);
      });
      describe('toggle layer', () => {
        const validList = [EXPECT_TOGGLE_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.toggle_layer);
      });
      describe('one shot layer', () => {
        const validList = [EXPECT_ONE_SHOT_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(
          validList,
          invalidList,
          KeycodeCompositionKind.one_shot_layer
        );
      });
      describe('one shot mod', () => {
        const validList = [EXPECT_ONE_SHOT_MOD_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.one_shot_mod);
      });
      describe('tap dance', () => {
        const validList = [EXPECT_TAP_DANCE_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.tap_dance);
      });
      describe('layer tap toggle', () => {
        const validList = [EXPECT_LAYER_TAP_TOGGLE_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(
          validList,
          invalidList,
          KeycodeCompositionKind.layer_tap_toggle
        );
      });
      describe('layer mod', () => {
        const validList = [EXPECT_LAYER_MOD_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.layer_mod);
      });
      describe('swap hands', () => {
        const validList = [EXPECT_SWAP_HANDS_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.swap_hands);
      });
      describe('mod tap', () => {
        const validList = [EXPECT_MOD_TAP_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.mod_tap);
      });
      describe('unicode', () => {
        const validList = [EXPECT_UNICODE_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.unicode);
      });
      describe('loose keycode', () => {
        const validList = [EXPECT_LOOSE_KEYCODE_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
          EXPECT_FUNCTION_LIST,
          EXPECT_MACRO_LIST,
          EXPECT_LAYER_TAP_LIST,
          EXPECT_TO_LIST,
          EXPECT_MOMENTARY_LIST,
          EXPECT_DEF_LAYER_LIST,
          EXPECT_TOGGLE_LAYER_LIST,
          EXPECT_ONE_SHOT_LAYER_LIST,
          EXPECT_ONE_SHOT_MOD_LIST,
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.loose_keycode);
      });
      describe('unknown', () => {
        test.each(EXPECT_UNKNOWN_LIST)(`unknown`, (value) => {
          const subject = new KeycodeCompositionFactory(value, {} as IHid);
          expect(subject.getKind()).toBeNull();
        });
      });
    });
  });
});

export {};