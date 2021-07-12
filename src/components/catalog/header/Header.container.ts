import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';
import { catalogActionsThunk } from '../../../actions/catalog.action';
import { AppActionsThunk } from '../../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    logout: () => {
      _dispatch(catalogActionsThunk.logout());
    },
    linkToGoogleAccount: () => {
      _dispatch(AppActionsThunk.linkToGoogleAccount());
    },
    linkToGitHubAccount: () => {
      _dispatch(AppActionsThunk.linkToGitHubAccount());
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
