/* eslint-disable no-undef */
import React from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';

type HeaderState = {};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
  }

  render() {
    return (
      <header className="catalog-header">
        <a href="/" className="catalog-header-logo">
          <Logo width={100} />
        </a>
        <div className="catalog-header-menu-button">
          <ProfileIcon
            logout={() => {
              this.props.logout!();
            }}
          />
        </div>
      </header>
    );
  }
}

export default Header;
