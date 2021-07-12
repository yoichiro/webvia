import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import ProfileIcon from './ProfileIcon';
import { AppActionsThunk } from '../../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
  };
};
export type ProfileIconStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    linkToGoogleAccount: () => {
      _dispatch(AppActionsThunk.linkToGoogleAccount());
    },
    linkToGitHubAccount: () => {
      _dispatch(AppActionsThunk.linkToGitHubAccount());
    },
  };
};
export type ProfileIconActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProfileIcon);
