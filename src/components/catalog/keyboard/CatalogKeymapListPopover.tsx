import React from 'react';
import './CatalogKeymapListPopover.scss';
import {
  CatalogKeymapListPopoverActionsType,
  CatalogKeymapListPopoverStateType,
} from './CatalogKeymapListPopover.container';
import {
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core';
import { AbstractKeymapData } from '../../../services/storage/Storage';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onClickApplySharedKeymapData: (savedKeymapData: AbstractKeymapData) => void;
};

type CatalogKeymapListPopoverProps = OwnProps &
  Partial<CatalogKeymapListPopoverActionsType> &
  Partial<CatalogKeymapListPopoverStateType>;

type OwnState = {
  popoverPosition: PopoverPosition;
};

export default class CatalogKeymapListPopover extends React.Component<
  CatalogKeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;

  constructor(
    props:
      | CatalogKeymapListPopoverProps
      | Readonly<CatalogKeymapListPopoverProps>
  ) {
    super(props);
    this.state = {
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

  render() {
    if (!this.props.position) {
      return null;
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
        className="catalog-keymap-list-root"
      >
        <div className="catalog-keymap-list-popover" ref={this.popoverRef}>
          <List dense={true}>
            {this.props.sharedKeymaps!.map(
              (item: AbstractKeymapData, index) => {
                return (
                  <ListItem
                    key={`catalog-keymap-list-keymap-${index}`}
                    button
                    onClick={() => {
                      this.props.onClickApplySharedKeymapData!(item);
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
                  </ListItem>
                );
              }
            )}
          </List>
        </div>
      </Popover>
    );
  }
}
