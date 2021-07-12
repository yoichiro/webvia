import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';
import { storageActionsThunk } from '../../../actions/storage.action';
import { IDeviceInformation } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  return {
    signedIn: state.app.signedIn,
    setupPhase: state.app.setupPhase,
    keyboardDefDocument: state.entities.keyboardDefinitionDocument,
    keyboard: state.entities.keyboard,
  };
};
export type ContentStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    fetchSavedKeymaps: (info: IDeviceInformation) => {
      _dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
      _dispatch(storageActionsThunk.fetchSharedKeymaps(info, true));
      _dispatch(storageActionsThunk.fetchMyAppliedKeymaps(info));
    },
  };
};
export type ContentActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
