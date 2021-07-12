import { connect } from 'react-redux';
import KeyboardDefinitionManagement from './KeyboardDefinitionManagement';
import { KeyboardsPhase, RootState } from '../../store/state';
import { NotificationActions } from '../../actions/actions';
import { storageActionsThunk } from '../../actions/storage.action';
import { KeyboardsAppActions } from '../../actions/keyboards.actions';

const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
    phase: state.keyboards.app.phase,
  };
};
export type KeyboardDefinitionManagementStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
    updateKeyboards: () => {
      _dispatch(storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    },
    updateKeyboard: (definitionId: string) => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(
        storageActionsThunk.fetchKeyboardDefinitionById(definitionId, 'edit')
      );
    },
    startInitializing: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.init));
    },
  };
};

export type KeyboardDefinitionManagementActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardDefinitionManagement);
