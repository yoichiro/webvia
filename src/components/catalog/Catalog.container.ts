import { connect } from 'react-redux';
import Catalog from './Catalog';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_SWITCH_TYPE,
  ALL_LED_TYPE,
  ALL_MCU_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  ICatalogPhase,
  IKeyboardFeatures,
  IKeyboardHotswapType,
  IKeyboardKeySwitchType,
  IKeyboardLedType,
  IKeyboardMcuType,
  IKeyboardOledType,
  IKeyboardSpeakerType,
  IKeyboardSplitType,
  IKeyboardStaggeredType,
  RootState,
} from '../../store/state';
import { AppActions, NotificationActions } from '../../actions/actions';
import {
  catalogActionsThunk,
  CatalogAppActions,
  CatalogSearchActions,
} from '../../actions/catalog.action';
import { storageActionsThunk } from '../../actions/storage.action';
import { ParsedQs } from 'qs';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
  };
};
export type CatalogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
    updateKeyboard: (definitionId: string, nextPhase: ICatalogPhase) => {
      _dispatch(CatalogAppActions.updatePhase('processing'));
      _dispatch(
        storageActionsThunk.fetchKeyboardDefinitionForCatalogById(
          definitionId,
          nextPhase
        )
      );
    },
    init: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
    applySharedKeymap: (definitionId: string, keymapId: string) => {
      _dispatch(catalogActionsThunk.applySharedKeymap(definitionId, keymapId));
    },
    updateSignedIn: (signedIn: boolean) => {
      _dispatch(AppActions.updateSignedIn(signedIn));
    },
    updateSearchCondition: (params: ParsedQs) => {
      if (params.keyword) {
        _dispatch(CatalogSearchActions.updateKeyword(params.keyword as string));
      }
      if (params.features) {
        (params.features as string).split(',').forEach((feature: string) => {
          if (ALL_SPLIT_TYPE.includes(feature as IKeyboardSplitType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_SPLIT_TYPE
              )
            );
          }
          if (ALL_STAGGERED_TYPE.includes(feature as IKeyboardStaggeredType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_STAGGERED_TYPE
              )
            );
          }
          if (ALL_LED_TYPE.includes(feature as IKeyboardLedType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_LED_TYPE
              )
            );
          }
          if (ALL_KEY_SWITCH_TYPE.includes(feature as IKeyboardKeySwitchType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_KEY_SWITCH_TYPE
              )
            );
          }
          if (ALL_HOTSWAP_TYPE.includes(feature as IKeyboardHotswapType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_HOTSWAP_TYPE
              )
            );
          }
          if (ALL_MCU_TYPE.includes(feature as IKeyboardMcuType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_MCU_TYPE
              )
            );
          }
          if (ALL_OLED_TYPE.includes(feature as IKeyboardOledType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_OLED_TYPE
              )
            );
          }
          if (ALL_SPEAKER_TYPE.includes(feature as IKeyboardSpeakerType)) {
            _dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_SPEAKER_TYPE
              )
            );
          }
        });
      }
    },
  };
};

export type CatalogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
