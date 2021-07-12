import { connect } from 'react-redux';
import KeymapListPopover from './KeymapListPopover';
import { RootState } from '../../../store/state';
import {
  AppActions,
  KeydiffActions,
  LayoutOptionsActions,
} from '../../../actions/actions';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import { IKeymap } from '../../../services/hid/Hid';
import { LayoutOption } from '../keymap/Keymap';
import { AbstractKeymapData } from '../../../services/storage/Storage';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    savedKeymaps: state.entities.savedKeymaps,
    keymaps: state.entities.device.keymaps,
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
    sharedKeymaps: state.entities.sharedKeymaps,
    appliedKeymaps: state.entities.appliedKeymaps,
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type KeymapListPopoverStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    applySavedKeymapData: (
      keymaps: { [pos: string]: IKeymap }[],
      layoutOptions: LayoutOption[],
      labelLang: KeyboardLabelLang
    ) => {
      _dispatch(AppActions.updateLangLabel(labelLang));
      _dispatch(KeydiffActions.clearKeydiff());
      _dispatch(AppActions.remapsSetKeys(keymaps));
      _dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
    },
    createOrUpdateAppliedKeymap: (savedKeymapData: AbstractKeymapData) => {
      _dispatch(
        storageActionsThunk.createOrUpdateAppliedKeymap(savedKeymapData)
      );
    },
  };
};

export type KeymapListPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapListPopover);
