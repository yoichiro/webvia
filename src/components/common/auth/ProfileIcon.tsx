import React from 'react';
import {
  ProfileIconActionsType,
  ProfileIconStateType,
} from './ProfileIcon.container';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Person, PersonOutline } from '@material-ui/icons';
import AuthProviderDialog from './AuthProviderDialog.container';
import {
  getGitHubProviderData,
  getGoogleProviderData,
} from '../../../services/auth/Auth';
import './ProfileIcon.scss';

type ProfileIconState = {
  authMenuAnchorEl: any;
  openAuthProviderDialog: boolean;
};
type OwnProps = {
  logout: () => void;
};
type ProfileIconProps = OwnProps &
  Partial<ProfileIconActionsType> &
  Partial<ProfileIconStateType>;

export default class ProfileIcon extends React.Component<
  ProfileIconProps,
  ProfileIconState
> {
  constructor(props: ProfileIconProps | Readonly<ProfileIconProps>) {
    super(props);
    this.state = {
      authMenuAnchorEl: null,
      openAuthProviderDialog: false,
    };
  }

  handleAuthMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      authMenuAnchorEl: event.currentTarget,
    });
  };

  handleAuthMenuClose = () => {
    this.setState({
      authMenuAnchorEl: null,
    });
  };

  async handleLogoutMenuClick() {
    await this.props.logout();
    this.setState({
      authMenuAnchorEl: null,
    });
  }

  async handleLinkGoogleAccountMenuClick() {
    this.setState({ authMenuAnchorEl: null });
    this.props.linkToGoogleAccount!();
  }

  async handleLinkGitHubAccountMenuClick() {
    this.setState({ authMenuAnchorEl: null });
    this.props.linkToGitHubAccount!();
  }

  private handleCloseAuthProviderDialog() {
    this.setState({ openAuthProviderDialog: false });
  }

  async handleLoginMenuClick() {
    this.setState({ authMenuAnchorEl: null, openAuthProviderDialog: true });
  }

  renderLinkGoogleAccountMenu() {
    const user = this.props.auth!.getCurrentAuthenticatedUser();
    if (user && !getGoogleProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-google-account"
          button={true}
          onClick={() => this.handleLinkGoogleAccountMenuClick()}
        >
          Link Google Account
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  renderLinkGitHubAccountMenu() {
    const user = this.props.auth!.getCurrentAuthenticatedUser();
    if (user && !getGitHubProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-github-account"
          button={true}
          onClick={() => this.handleLinkGitHubAccountMenuClick()}
        >
          Link GitHub Account
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  render() {
    const { authMenuAnchorEl } = this.state;
    if (this.props.signedIn) {
      const user = this.props.auth!.getCurrentAuthenticatedUser();
      const profileImageUrl = user.photoURL || '';
      const profileDisplayName = user.displayName || '';
      let avatar: React.ReactNode;
      if (profileImageUrl) {
        avatar = (
          <Avatar
            alt={profileDisplayName}
            src={profileImageUrl}
            className="profile-icon-avatar"
          />
        );
      } else {
        avatar = (
          <Avatar className="profile-icon-avatar">
            <Person />
          </Avatar>
        );
      }
      return (
        <React.Fragment>
          <IconButton
            aria-owns={authMenuAnchorEl ? 'profile-icon-auth-menu' : undefined}
            onClick={this.handleAuthMenuIconClick}
          >
            {avatar}
          </IconButton>
          <Menu
            id="profile-icon-auth-menu"
            anchorEl={authMenuAnchorEl}
            open={Boolean(authMenuAnchorEl)}
            onClose={this.handleAuthMenuClose}
          >
            {this.renderLinkGoogleAccountMenu()}
            {this.renderLinkGitHubAccountMenu()}
            <MenuItem
              key="profile-icon-menu-logout"
              button={true}
              onClick={() => this.handleLogoutMenuClick()}
            >
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <IconButton
            aria-owns={authMenuAnchorEl ? 'profile-icon-auth-menu' : undefined}
            onClick={this.handleAuthMenuIconClick}
          >
            <Avatar className="profile-icon-avatar">
              <PersonOutline />
            </Avatar>
          </IconButton>
          <Menu
            id="profile-icon-auth-menu"
            anchorEl={authMenuAnchorEl}
            open={Boolean(authMenuAnchorEl)}
            onClose={this.handleAuthMenuClose}
          >
            <MenuItem
              key="profile-icon-menu-login"
              button={true}
              onClick={() => this.handleLoginMenuClick()}
            >
              Login
            </MenuItem>
          </Menu>
          <AuthProviderDialog
            open={this.state.openAuthProviderDialog}
            onClose={this.handleCloseAuthProviderDialog.bind(this)}
          />
        </React.Fragment>
      );
    }
  }
}
