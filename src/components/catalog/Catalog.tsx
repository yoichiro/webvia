import React from 'react';
import { Button, CssBaseline } from '@material-ui/core';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { ProviderContext, withSnackbar } from 'notistack';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { CatalogActionsType, CatalogStateType } from './Catalog.container';
import { NotificationItem } from '../../actions/actions';
import CloseIcon from '@material-ui/icons/Close';
import * as qs from 'qs';

type ICatalogDetailMode = 'introduction' | 'keymap';

type ParamsType = {
  definitionId: string;
};
type OwnProps = {
  catalogDetailMode?: ICatalogDetailMode;
};
type CatalogProps = OwnProps &
  Partial<CatalogStateType> &
  Partial<CatalogActionsType> &
  ProviderContext &
  RouteComponentProps<ParamsType>;
type OwnState = {};

class Catalog extends React.Component<CatalogProps, OwnState> {
  private displayedNotificationIds: string[] = [];

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

  componentDidMount() {
    if (this.props.auth) {
      this.props.auth.subscribeAuthStatus((user) => {
        this.props.updateSignedIn!(!!user);
      });
    }

    this.updateNotifications();
    if (this.props.catalogDetailMode === 'introduction') {
      const definitionId = this.props.match.params.definitionId;
      this.props.updateKeyboard!(definitionId, 'introduction');
    } else if (this.props.catalogDetailMode === 'keymap') {
      const definitionId = this.props.match.params.definitionId;
      this.props.updateKeyboard!(definitionId, 'keymap');
      const queryParams = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      });
      const keymapId: string = queryParams.id as string;
      if (keymapId) {
        this.props.applySharedKeymap!(definitionId, keymapId);
      }
    } else {
      const queryParams = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      });
      this.props.updateSearchCondition!(queryParams);
      this.props.init!();
    }
  }

  componentDidUpdate() {
    this.updateNotifications();
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <Content />
        </main>
      </React.Fragment>
    );
  }
}

export default withSnackbar(withRouter(Catalog));
