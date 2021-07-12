/* eslint-disable no-undef */
import React from 'react';
import './Configure.scss';
import { ProviderContext, withSnackbar } from 'notistack';
import Header from './header/Header.container';
import Content from './content/Content.container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CloseIcon from '@material-ui/icons/Close';
import {
  ConfigureActionsType,
  ConfigureStateType,
} from './Configure.container';
import appPackage from '../../package.alias.json';
import { NotificationItem } from '../../actions/actions';
import { Button } from '@material-ui/core';
import { IKeyboard } from '../../services/hid/Hid';
import Footer from '../common/footer/Footer.container';

type OwnProps = {};
type ConfigureProps = OwnProps &
  Partial<ConfigureStateType> &
  Partial<ConfigureActionsType> &
  ProviderContext;
type OwnState = {
  supportedBrowser: boolean;
};

class Configure extends React.Component<ConfigureProps, OwnState> {
  private displayedNotificationIds: string[] = [];
  constructor(props: ConfigureProps) {
    super(props);
    this.state = {
      supportedBrowser: true,
    };
  }

  private storeDisplayedNotification = (key: string) => {
    this.displayedNotificationIds = [...this.displayedNotificationIds, key];
  };

  private removeDisplayedNotification = (key: string) => {
    this.displayedNotificationIds = [
      ...this.displayedNotificationIds.filter((k) => key !== k),
    ];
  };

  private updateNotifications() {
    this.props.notifications!.forEach((item: NotificationItem) => {
      if (this.displayedNotificationIds.includes(item.key)) return;

      this.props.enqueueSnackbar(item.message, {
        key: item.key,
        variant: item.type,
        autoHideDuration: 5000,
        onExited: (event, key: React.ReactText) => {
          this.props.removeNotification!(key as string);
          this.removeDisplayedNotification(key as string);
        },
        action: (key: number) => (
          <Button
            onClick={() => {
              this.props.closeSnackbar(key);
            }}
          >
            <CloseIcon />
          </Button>
        ),
      });
      this.storeDisplayedNotification(item.key);
    });
  }

  private updateTitle() {
    const hasKeysToFlush = this.props.remaps!.reduce((has, v) => {
      return 0 < Object.values(v).length || has;
    }, false);
    const title = hasKeysToFlush ? `*${appPackage.name}` : appPackage.name;
    // eslint-disable-next-line no-undef
    document.title = title;
  }

  private initKeyboardConnectionEventHandler() {
    this.props.hid!.instance.setConnectionEventHandler({
      connect: (connectedKeyboard: IKeyboard) => {
        this.props.onConnectKeyboard!(connectedKeyboard);
      },
      disconnect: (disconnectedKeyboard: IKeyboard) => {
        this.props.onDisconnectKeyboard!(
          disconnectedKeyboard,
          this.props.keyboard!
        );
      },
      close: (keyboard: IKeyboard) => {
        this.props.onCloseKeyboard!(keyboard);
      },
    });
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    if ((navigator as any).hid === undefined) {
      this.setState({
        supportedBrowser: false,
      });
      return;
    }
    const version = appPackage.version;
    const name = appPackage.name;
    this.props.initAppPackage!(name, version);

    if (this.props.auth) {
      this.props.auth.subscribeAuthStatus((user) => {
        this.props.updateSignedIn!(!!user);
      });
    }

    this.updateTitle();
    this.updateNotifications();
    this.initKeyboardConnectionEventHandler();
    this.props.updateAuthorizedKeyboardList!();
  }

  componentDidUpdate() {
    this.updateTitle();
    this.updateNotifications();

    if (this.props.testMatrix) {
      // Ignore all key event when TEST MATRIX MODE
      window.onkeydown = (e: any) => {
        e.preventDefault();
      };
      window.onkeyup = (e: any) => {
        e.preventDefault();
      };
    } else {
      window.onkeydown = null;
      window.onkeyup = null;
    }
  }

  render() {
    if (!this.state.supportedBrowser) {
      return (
        <React.Fragment>
          <CssBaseline />

          <Header />
          <main>
            <UnsupportBrowser />
          </main>
          <Footer />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="configure-root">
          <CssBaseline />
          <Header />
          <main>
            <Content />
          </main>
          {(this.props.draggingKey || this.props.testMatrix) && (
            <div className="dragMask fill-blank"></div>
          )}
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(Configure);

function UnsupportBrowser() {
  return (
    <div className="message-box-wrapper">
      <div className="message-box">
        <h1>Unsupported Web Browser</h1>
        <p>
          <a href="https://remap-keys.app">Remap</a> works on Web Browsers which
          the <a href="https://wicg.github.io/webhid/">WebHID API</a> is
          supported.
          <br />
          For example, <a href="https://www.google.com/chrome">
            Google Chrome
          </a>{' '}
          version 89 or later supports the WebHID API.
        </p>
        <p style={{ color: 'red' }}>
          *
          <a
            href="https://developer.chrome.com/origintrials/#/view_trial/1074108511127863297"
            target="_blank"
            rel="noreferrer"
          >
            Trial for WebHID on Google Chrome (ver. 86-88)
          </a>{' '}
          has been completed. Please use the version 89 of Google Chrome stable
          which will be{' '}
          <a
            href="https://www.chromestatus.com/features/schedule"
            target="_blank"
            rel="noreferrer"
          >
            released on March 2nd
          </a>
          , or use the version 89 or higher of
          <a
            href="https://www.google.com/chrome/beta/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome beta
          </a>{' '}
          or{' '}
          <a
            href="https://www.google.com/chrome/canary/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome Canary
          </a>
          .
        </p>
      </div>
    </div>
  );
}
