import { connect } from 'react-redux';
import AuthProviderDialog from './AuthProviderDialog';
import { RootState } from '../../../store/state';
import { AppActionsThunk } from '../../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {};
};
export type AuthProviderDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    loginWithGitHubAccount: () => {
      _dispatch(AppActionsThunk.loginWithGitHubAccount());
    },
    loginWithGoogleAccount: () => {
      _dispatch(AppActionsThunk.loginWithGoogleAccount());
    },
  };
};
export type AuthProviderDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(AuthProviderDialog);
