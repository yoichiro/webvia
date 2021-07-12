import {
  ICatalogPhase,
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../store/state';
import { IKeymap } from '../services/hid/Hid';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { AbstractKeymapData } from '../services/storage/Storage';
import { KeycodeList } from '../services/hid/KeycodeList';
import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const CATALOG_APP_ACTIONS = `@CatalogApp`;
export const CATALOG_APP_UPDATE_PHASE = `${CATALOG_APP_ACTIONS}/UpdatePhase`;
export const CatalogAppActions = {
  updatePhase: (phase: ICatalogPhase) => {
    return {
      type: CATALOG_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

export const CATALOG_SEARCH_ACTIONS = `@CatalogSearch`;
export const CATALOG_SEARCH_UPDATE_FEATURES = `${CATALOG_SEARCH_ACTIONS}/UpdateFeatures`;
export const CATALOG_SEARCH_UPDATE_KEYWORD = `${CATALOG_SEARCH_ACTIONS}/UpdateKeyword`;
export const CATALOG_SEARCH_CLEAR_FEATURES = `${CATALOG_SEARCH_ACTIONS}/ClearFeatures`;
export const CatalogSearchActions = {
  updateFeatures: (
    value: IKeyboardFeatures | IConditionNotSelected,
    targetFeatures: readonly IKeyboardFeatures[]
  ) => {
    return {
      type: CATALOG_SEARCH_UPDATE_FEATURES,
      value: {
        value,
        targetFeatures,
      },
    };
  },
  updateKeyword: (value: string) => {
    return {
      type: CATALOG_SEARCH_UPDATE_KEYWORD,
      value,
    };
  },
  clearFeatures: () => {
    return {
      type: CATALOG_SEARCH_CLEAR_FEATURES,
    };
  },
};

export const CATALOG_KEYBOARD_ACTIONS = `@CatalogKeyboard`;
export const CATALOG_KEYBOARD_UPDATE_KEYMAPS = `${CATALOG_KEYBOARD_ACTIONS}/UpdateKeymaps`;
export const CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER = `${CATALOG_KEYBOARD_ACTIONS}/UpdateSelectedLayer`;
export const CATALOG_KEYBOARD_UPDATE_LANG_LABEL = `${CATALOG_KEYBOARD_ACTIONS}/UpdateLangLabel`;
export const CatalogKeyboardActions = {
  updateKeymaps: (
    keymaps: {
      [pos: string]: IKeymap;
    }[]
  ) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_KEYMAPS,
      value: keymaps,
    };
  },
  updateSelectedLayer: (selectedLayer: number) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER,
      value: selectedLayer,
    };
  },
  updateLangLabel: (langLabel: KeyboardLabelLang) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_LANG_LABEL,
      value: langLabel,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof CatalogKeyboardActions[keyof typeof CatalogKeyboardActions]
  | typeof LayoutOptionsActions[keyof typeof LayoutOptionsActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof AppActions[keyof typeof AppActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const catalogActionsThunk = {
  // eslint-disable-next-line no-undef
  applySharedKeymapData: (
    savedKeymapData: AbstractKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const labelLang = savedKeymapData.label_lang;
    const layoutOptions = savedKeymapData.layout_options;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] = savedKeymapData.keycodes;
    for (let i = 0; i < savedKeycodes.length; i++) {
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      // When the savedKeycodes was stored for BMP MCU, the length may be 11.
      // Therefore, the target layer must be checked to ensure that the value
      // is less than the savedKeycodes length.
      // See: https://github.com/remap-keys/remap/issues/454
      if (i < savedKeycodes.length) {
        Object.keys(savedCode).forEach((pos) => {
          changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
        });
      }
      keycodes.push(changes);
    }
    dispatch(CatalogKeyboardActions.updateLangLabel(labelLang));
    dispatch(AppActions.updateLangLabel(labelLang));
    dispatch(CatalogKeyboardActions.updateKeymaps(keycodes));
    dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
    dispatch(CatalogKeyboardActions.updateSelectedLayer(0));
  },
  applySharedKeymap: (
    definitionId: string,
    keymapId: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const result = await storage.instance!.fetchSharedKeymap(keymapId);
    if (result.success) {
      dispatch(
        await catalogActionsThunk.applySharedKeymapData(result.sharedKeymap!)
      );
    } else {
      console.error(result.error);
      dispatch(NotificationActions.addError(result.error!, result.cause));
      history.replaceState(null, 'Remap', `/catalog/${definitionId}/keymap`);
    }
  },
  logout: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { auth } = getState();
    dispatch(AppActions.updateSignedIn(false));
    await auth.instance!.signOut();
  },
};
