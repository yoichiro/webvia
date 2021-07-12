/* eslint-disable no-undef */
import React from 'react';
import './Header.scss';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { IKeyboard, IKeymap } from '../../../services/hid/Hid';
import { Logo } from '../../common/logo/Logo';
import InfoDialog from '../info/InfoDialog.container';
import { InfoIcon } from '../../common/icons/InfoIcon';
import {
  IKeyboardDefinitionDocument,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import ProfileIcon from '../../common/auth/ProfileIcon.container';

type HeaderState = {
  connectionStateEl: any;
  logoAnimation: boolean;
  openInfoDialog: boolean;
};

type OwnProps = {};

type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default class Header extends React.Component<HeaderProps, HeaderState> {
  private hasKeysToFlash: boolean = false;
  flashButtonRef: React.RefObject<HTMLButtonElement>;
  deviceMenuRef: React.RefObject<HTMLDivElement>;
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      connectionStateEl: null,
      logoAnimation: false,
      openInfoDialog: false,
    };
    this.flashButtonRef = React.createRef<HTMLButtonElement>();
    this.deviceMenuRef = React.createRef<HTMLDivElement>();
  }

  shouldComponentUpdate(nextProps: HeaderProps) {
    if (
      this.props.showKeyboardList &&
      this.props.keyboards!.length < nextProps.keyboards!.length
    ) {
      this.onClickDevice();
    }

    if (this.props.keyboard && !nextProps.keyboard) {
      this.setState({ openInfoDialog: false });
    }

    return true;
  }

  get openConnectionStateMenu() {
    return Boolean(this.state.connectionStateEl);
  }

  private onCloseConnectionStateMenu() {
    this.setState({ connectionStateEl: null });
  }

  private onClickDevice() {
    this.setState({ connectionStateEl: this.deviceMenuRef.current });
  }

  private onClickConnectionMenuItemNewDevice() {
    this.onCloseConnectionStateMenu();
    this.props.onClickAnotherKeyboard!();
  }

  private onClickFlash() {
    if (this.hasKeysToFlash) {
      this.props.onClickFlashButton!();
    }
  }

  private onClickKeyboardMenuItem(kbd: IKeyboard) {
    this.onCloseConnectionStateMenu();
    this.props.onClickKeyboardMenuItem!(kbd);
  }

  private onClickShowInfoDialog() {
    this.setState({ openInfoDialog: true });
  }

  private onCloseInfoDialog() {
    this.setState({ openInfoDialog: false });
  }

  private endLogoAnim() {
    this.setState({ logoAnimation: false });
  }

  private startLogoAnim() {
    this.setState({ logoAnimation: true });
  }

  render() {
    this.hasKeysToFlash = this.props.remaps!.reduce(
      (has: boolean, v: { [pos: string]: IKeymap }) => {
        return 0 < Object.values(v).length || has;
      },
      false
    );

    let flashBtnState: FlashButtonState = this.hasKeysToFlash
      ? 'enable'
      : 'disable';
    if (this.props.flashing) {
      flashBtnState = 'flashing';
    } else if (
      flashBtnState == 'disable' &&
      this.flashButtonRef.current?.classList.contains('flashing')
    ) {
      flashBtnState = 'success';
      setTimeout(() => {
        this.flashButtonRef.current?.classList.remove('success');
        this.flashButtonRef.current?.classList.add('disable');
      }, 2500);
    }

    return (
      <React.Fragment>
        <header className="header">
          <div
            ref={this.deviceMenuRef}
            className={[
              'kbd-device',
              this.props.showKeyboardList ? '' : 'hidden',
            ].join(' ')}
          >
            <div className="kbd-select">
              <div className="kbd-name" onClick={this.onClickDevice.bind(this)}>
                <h2>{this.props.productName}</h2>
                <div className="ids">
                  VID: {hexadecimal(this.props.vendorId!, 4)} / PID:{' '}
                  {hexadecimal(this.props.productId!, 4)}
                </div>
              </div>
              <ArrowDropDown onClick={this.onClickDevice.bind(this)} />
              <div className="device-list">
                <Menu
                  anchorEl={this.state.connectionStateEl}
                  keepMounted
                  open={this.openConnectionStateMenu}
                  onClose={this.onCloseConnectionStateMenu.bind(this)}
                  PaperProps={{
                    style: {
                      maxHeight: 250,
                    },
                  }}
                >
                  {this.props.keyboards!.map((kbd, index) => {
                    const info = kbd.getInformation();
                    const isOpenedKbd = this.props.keyboard == kbd;
                    const linking = isOpenedKbd ? 'link-on' : 'link-off';
                    return (
                      <MenuItem
                        key={index}
                        onClick={
                          isOpenedKbd
                            ? undefined
                            : this.onClickKeyboardMenuItem.bind(this, kbd)
                        }
                        disabled={isOpenedKbd}
                      >
                        <div className="device-item">
                          {isOpenedKbd && (
                            <Link
                              fontSize="small"
                              className="link-icon link-on"
                            />
                          )}
                          <div className={['device-name', linking].join(' ')}>
                            {info.productName}
                            <span className="device-ids">
                              (VID: {hexadecimal(info.vendorId, 4)} / PID:{' '}
                              {hexadecimal(info.productId, 4)})
                            </span>
                          </div>
                        </div>
                      </MenuItem>
                    );
                  })}

                  <MenuItem
                    key="another"
                    onClick={this.onClickConnectionMenuItemNewDevice.bind(this)}
                  >
                    <div className="another-device-wrapper">
                      <Button
                        size="small"
                        color="primary"
                        className="another-device"
                      >
                        + KEYBOARD
                      </Button>
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <InfoDialogButton
              keyboardDefinitionDocument={this.props.keyboardDefinitionDocument}
              onClick={this.onClickShowInfoDialog.bind(this)}
            />
          </div>

          <div className="header-logo">
            <a
              href="/"
              onMouseEnter={this.startLogoAnim.bind(this)}
              onMouseLeave={this.endLogoAnim.bind(this)}
            >
              <Logo width={100} animation={this.state.logoAnimation} />
            </a>
          </div>

          <div className="header-right">
            <div
              className={['buttons', this.props.keyboard ? '' : 'hidden'].join(
                ' '
              )}
            >
              <button
                ref={this.flashButtonRef}
                disabled={flashBtnState == 'disable'}
                onClick={this.onClickFlash.bind(this)}
                className={['flash-button', flashBtnState].join(' ')}
              >
                flash
              </button>
            </div>
            <ProfileIcon logout={() => this.props.logout!()} />
          </div>
          {(this.props.draggingKey || this.props.testMatrix) && (
            <div className="dragMask header-height"></div>
          )}
          <ConnectionModal open={false} onClose={() => {}} />
        </header>
        <InfoDialog
          open={this.state.openInfoDialog}
          onClose={this.onCloseInfoDialog.bind(this)}
        />
      </React.Fragment>
    );
  }
}

const FlashButtonStates = ['disable', 'enable', 'flashing', 'success'] as const;
type FlashButtonState = typeof FlashButtonStates[number];

type IInfoDialogButton = {
  keyboardDefinitionDocument: IKeyboardDefinitionDocument | null | undefined;
  onClick: () => void;
};

function InfoDialogButton(props: IInfoDialogButton) {
  const color = props.keyboardDefinitionDocument
    ? props.keyboardDefinitionDocument.status ===
      KeyboardDefinitionStatus.approved
      ? 'primary'
      : 'secondary'
    : 'primary';
  return (
    <IconButton onClick={props.onClick}>
      <InfoIcon color={color} />
    </IconButton>
  );
}
