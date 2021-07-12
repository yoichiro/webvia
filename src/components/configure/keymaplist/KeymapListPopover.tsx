/* eslint-disable no-undef */
import React, { useState } from 'react';
import './KeymapListPopover.scss';
import {
  KeymapListPopoverActionsType,
  KeymapListPopoverStateType,
} from './KeymapListPopover.container';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import KeymapSaveDialog from './KeymapSaveDialog.container';
import {
  AbstractKeymapData,
  AppliedKeymapData,
  IKeyboardDefinitionDocument,
  SavedKeymapData,
} from '../../../services/storage/Storage';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import AuthProviderDialog from '../../common/auth/AuthProviderDialog.container';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import { Link, SupervisorAccount } from '@material-ui/icons';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type KeymapListPopoverProps = OwnProps &
  Partial<KeymapListPopoverActionsType> &
  Partial<KeymapListPopoverStateType>;

type OwnState = {
  openKeymapSaveDialog: boolean;
  savedKeymapData: SavedKeymapData | null;
  openAuthProviderDialog: boolean;
  popoverPosition: PopoverPosition;
};

export default class KeymapListPopover extends React.Component<
  KeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      openKeymapSaveDialog: false,
      savedKeymapData: null,
      openAuthProviderDialog: false,
      popoverPosition: { top: 0, left: 0 },
    };
    this.popoverRef = React.createRef<HTMLDivElement>();
  }

  private onEnter() {
    if (this.popoverRef.current && this.props.position) {
      // Adjust the Popover position regarding to its size.
      const { left, top } = this.props.position;
      const { width, height } = this.popoverRef.current.getBoundingClientRect();
      const iconSize = 30;
      const margin = 10;

      let x = 0;
      let y = 0;
      if (window.innerWidth < left + width + iconSize + margin) {
        // show the dialog below the icon
        x = Math.min(left, left - (width - (window.innerWidth - left)));
        y = top + iconSize + margin; // 10=margin
      } else {
        // show the dialog right side of the icon
        x = left + iconSize + margin; // 10=margin
        y = top - height / 2 + iconSize / 2;
      }
      this.setState({ popoverPosition: { left: x, top: y } });
    }
  }

  private onClickApplySavedKeymapData(savedKeymapData: AbstractKeymapData) {
    sendEventToGoogleAnalytics('configure/restore_keymap', {
      vendor_id: savedKeymapData.vendor_id,
      product_id: savedKeymapData.product_id,
      product_name: savedKeymapData.product_name,
    });

    const labelLang = savedKeymapData.label_lang;
    const layoutOptions = savedKeymapData.layout_options;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] = savedKeymapData.keycodes;
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    for (let i = 0; i < keymaps.length; i++) {
      const keymap = keymaps[i];
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      // When the savedKeycodes was stored for BMP MCU, the length may be 11.
      // Therefore, the target layer must be checked to ensure that the value
      // is less than the savedKeycodes length.
      // See: https://github.com/remap-keys/remap/issues/454
      if (i < savedKeycodes.length) {
        Object.keys(keymap).forEach((pos) => {
          if (keymap[pos].code != savedCode[pos]) {
            changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
          }
        });
      }
      keycodes.push(changes);
    }

    this.props.applySavedKeymapData!(keycodes, layoutOptions, labelLang);

    const uid = this.props.auth!.getCurrentAuthenticatedUser().uid;
    if (uid !== savedKeymapData.author_uid) {
      this.props.createOrUpdateAppliedKeymap!(savedKeymapData);
    }
  }

  private onClickOpenKeymapSaveDialog(savedKeymapData: SavedKeymapData | null) {
    this.setState({ openKeymapSaveDialog: true, savedKeymapData });
  }

  private onCloseKeymapSaveDialog() {
    this.setState({ openKeymapSaveDialog: false, savedKeymapData: null });
  }

  private onClickSignIn() {
    this.setState({ openAuthProviderDialog: true });
  }

  private onCloseAuthProviderDialog() {
    this.setState({ openAuthProviderDialog: false });
  }

  render() {
    if (!this.props.position) {
      return <></>;
    }

    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.state.popoverPosition}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="keymaplist-root"
      >
        <div className="keymaplist-popover" ref={this.popoverRef}>
          {this.props.signedIn ? (
            <>
              <KeymapList
                savedKeymaps={this.props.savedKeymaps!}
                sharedKeymaps={this.props.sharedKeymaps!}
                appliedKeymaps={this.props.appliedKeymaps!}
                definitionDocument={this.props.definitionDocument || null}
                onClickOpenKeymapSaveDialog={this.onClickOpenKeymapSaveDialog.bind(
                  this
                )}
                onClickApplySavedKeymapData={this.onClickApplySavedKeymapData.bind(
                  this
                )}
              />
              <KeymapSaveDialog
                open={this.state.openKeymapSaveDialog}
                savedKeymapData={this.state.savedKeymapData}
                authorUid={this.props.auth!.getCurrentAuthenticatedUser().uid}
                authorDisplayName={
                  this.props.auth!.getCurrentAuthenticatedUser().displayName!
                }
                onClose={() => {
                  this.onCloseKeymapSaveDialog();
                }}
              />
            </>
          ) : (
            <RequestSignIn onClickSignIn={this.onClickSignIn.bind(this)} />
          )}
        </div>

        <AuthProviderDialog
          open={this.state.openAuthProviderDialog}
          onClose={this.onCloseAuthProviderDialog.bind(this)}
        />
      </Popover>
    );
  }
}

type KeymapListProps = {
  savedKeymaps: SavedKeymapData[];
  sharedKeymaps: SavedKeymapData[];
  appliedKeymaps: AppliedKeymapData[];
  onClickOpenKeymapSaveDialog: (
    // eslint-disable-next-line no-unused-vars
    savedKeymapData: SavedKeymapData | null
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: AbstractKeymapData) => void;
  definitionDocument: IKeyboardDefinitionDocument | null;
};

function KeymapList(props: KeymapListProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  return (
    <>
      <div className="keymaplist keymaplist-header">
        <div>
          <h2>Keymaps</h2>
        </div>
        <div className="keymaplist-header-buttons">
          <Button
            color="primary"
            onClick={() => {
              props.onClickOpenKeymapSaveDialog(null);
            }}
          >
            SAVE CURRENT KEYMAP
          </Button>
        </div>
      </div>
      <div className="keymaplist keymaplist-content">
        <Tabs
          value={activeTabIndex}
          indicatorColor="primary"
          textColor="primary"
          aria-label="Keymaps"
          onChange={onTabChange}
        >
          <Tab label="Mine" />
          <Tab label="Shared" />
          <Tab label="History" />
        </Tabs>
        {activeTabIndex === 0 ? (
          <MyKeymapList
            savedKeymaps={props.savedKeymaps}
            onClickOpenKeymapSaveDialog={props.onClickOpenKeymapSaveDialog}
            onClickApplySavedKeymapData={props.onClickApplySavedKeymapData}
            definitionDocument={props.definitionDocument}
          />
        ) : activeTabIndex === 1 ? (
          <SharedKeymapList
            sharedKeymaps={props.sharedKeymaps}
            onClickApplySavedKeymapData={props.onClickApplySavedKeymapData}
            definitionDocument={props.definitionDocument}
          />
        ) : (
          <SharedKeymapList
            sharedKeymaps={props.appliedKeymaps}
            onClickApplySavedKeymapData={props.onClickApplySavedKeymapData}
          />
        )}
      </div>
    </>
  );
}

type ISharedKeymapListProps = {
  sharedKeymaps: AbstractKeymapData[];
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: AbstractKeymapData) => void;
  definitionDocument?: IKeyboardDefinitionDocument | null;
};
function SharedKeymapList(props: ISharedKeymapListProps) {
  return (
    <React.Fragment>
      <List dense={true}>
        {props.sharedKeymaps.map((item: AbstractKeymapData, index) => {
          return (
            <ListItem
              key={`keymaplist-keymap${index}`}
              button
              onClick={() => {
                props.onClickApplySavedKeymapData(item);
              }}
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                    >
                      {` by ${item.author_display_name}`}
                    </Typography>
                  </React.Fragment>
                }
                secondary={item.desc}
              />
              {props.definitionDocument ? (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="link"
                    href={`/catalog/${props.definitionDocument!.id}/keymap?id=${
                      item.id
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : null}
            </ListItem>
          );
        })}
      </List>
      {props.sharedKeymaps!.length === 0 && (
        <div className="no-saved-keymap">There is no shared keymaps.</div>
      )}
    </React.Fragment>
  );
}

type IMyKeymapListProps = {
  savedKeymaps: SavedKeymapData[];
  onClickOpenKeymapSaveDialog: (
    // eslint-disable-next-line no-unused-vars
    savedKeymapData: SavedKeymapData | null
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: SavedKeymapData) => void;
  definitionDocument: IKeyboardDefinitionDocument | null;
};
function MyKeymapList(props: IMyKeymapListProps) {
  return (
    <React.Fragment>
      <List dense={true}>
        {props.savedKeymaps.map((item: SavedKeymapData, index) => {
          return (
            <ListItem
              key={`keymaplist-keymap${index}`}
              button
              onClick={() => {
                props.onClickApplySavedKeymapData(item);
              }}
            >
              <ListItemText
                primary={
                  <div className="my-keymaplist-header">
                    {item.status === 'shared' ? (
                      <SupervisorAccount
                        fontSize="small"
                        color="action"
                        className="my-keymaplist-header-shared"
                      />
                    ) : null}
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary"
                    >
                      {item.title}
                    </Typography>
                  </div>
                }
                secondary={item.desc}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    props.onClickOpenKeymapSaveDialog(item);
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>
                {props.definitionDocument && item.status === 'shared' ? (
                  <IconButton
                    edge="end"
                    aria-label="link"
                    href={`/catalog/${props.definitionDocument!.id}/keymap?id=${
                      item.id
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link />
                  </IconButton>
                ) : null}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      {props.savedKeymaps!.length === 0 && (
        <div className="no-saved-keymap">
          You can save the current keymap by clicking the top-right button. You
          can restore your saved keymap every time.
          <div className="keymaplist-warning">
            * Please note that the change candidates will discard when you
            save/restore the keymap.
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

type RequestSignInType = {
  onClickSignIn: () => void;
};
function RequestSignIn(props: RequestSignInType) {
  return (
    <div className="request-signin">
      <div>
        You can save/restore the current keymap. Using this feature, you can
        manage many kinds of keymaps.
      </div>
      <div className="request-signin-message">
        *You need to sign in to use this feature.
      </div>
      <div className="request-signin-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.onClickSignIn();
          }}
        >
          SignIn
        </Button>
      </div>
    </div>
  );
}
