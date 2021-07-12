/* eslint-disable no-undef */
import React from 'react';
import './LayoutOptionPopover.scss';
import {
  LayoutOptionPopoverActionsType,
  LayoutOptionPopoverStateType,
} from './LayoutOptionPopover.container';
import { Grid, MenuItem, Popover, Select, Switch } from '@material-ui/core';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
  hidSupport: boolean;
};

type LayoutOptionPopoverProps = OwnProps &
  Partial<LayoutOptionPopoverActionsType> &
  Partial<LayoutOptionPopoverStateType>;

type OwnState = {};

export default class LayoutOptionPopover extends React.Component<
  LayoutOptionPopoverProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  get position(): { left: number; top: number } {
    if (!this.props.position) {
      return {
        left: 0,
        top: 0,
      };
    }
    const { left, top } = this.props.position;

    const width = 360; // popover width
    const iconSize = 30;
    const y = top + iconSize + 10; // 10=margin
    if (window.innerWidth < left + width) {
      const x = left - (width - (window.innerWidth - left));
      return { left: x, top: y };
    }
    return { left: left, top: y };
  }

  private getSelectedOptionChoice(option: number): number {
    const layoutOption = this.props.selectedLayoutOptions!.find((options) => {
      return options.option === option;
    });

    return layoutOption ? layoutOption.optionChoice : 0;
  }

  render() {
    if (
      !this.props.position ||
      !this.props.selectedLayoutOptions ||
      0 === this.props.selectedLayoutOptions.length
    ) {
      return <></>;
    }

    const labels = this.props.keyboardLayoutOptions!;
    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.position}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="layout-option-root"
      >
        <div className="layout-option-popover">
          <Grid container className="layout-option-header">
            <Grid item xs={12} className="layout-option-title">
              <h2>Layout Option</h2>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="layout-option-content">
            {labels.map((options, index) => {
              if (typeof options == 'string') {
                return (
                  <OptionRowSwitchComponent
                    key={`layout-option-row${index}`}
                    optionLabel={options}
                    selectedOptionChoice={this.getSelectedOptionChoice(index)}
                    onChange={(choice: number) => {
                      this.props.setLayoutOption!(
                        index,
                        choice,
                        this.props.hidSupport
                      );
                    }}
                  />
                );
              } else {
                return (
                  <OptionRowSelectComponent
                    key={`layout-option-row${index}`}
                    optionLabels={options}
                    selectedOptionChoice={this.getSelectedOptionChoice(index)}
                    onChange={(choice: number) => {
                      this.props.setLayoutOption!(
                        index,
                        choice,
                        this.props.hidSupport
                      );
                    }}
                  />
                );
              }
            })}
          </Grid>
        </div>
      </Popover>
    );
  }
}

type OptionRowSwitchType = {
  optionLabel: string;
  selectedOptionChoice: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionChoice: number) => void;
};
function OptionRowSwitchComponent(props: OptionRowSwitchType) {
  return (
    <React.Fragment>
      <Grid item xs={8} className="option-label">
        {props.optionLabel}
      </Grid>
      <Grid item xs={4} className="option-value">
        <Switch
          checked={props.selectedOptionChoice === 1}
          onChange={(e) => {
            props.onChange(e.target.checked ? 1 : 0);
          }}
          color="primary"
          name="checkedB"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </Grid>
    </React.Fragment>
  );
}

type OptionRowSelectType = {
  optionLabels: string[];
  selectedOptionChoice: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionChoice: number) => void;
};
function OptionRowSelectComponent(props: OptionRowSelectType) {
  const label = props.optionLabels[0];
  const choices: string[] = props.optionLabels.slice(1);
  return (
    <React.Fragment>
      <Grid item xs={8} className="option-label">
        {label}
      </Grid>
      <Grid item xs={4} className="option-value">
        <Select
          value={props.selectedOptionChoice}
          onChange={(e) => {
            props.onChange(Number(e.target.value));
          }}
          className="option-value-select"
        >
          {choices.map((choice, index) => {
            return (
              <MenuItem key={`${label}${index}`} value={index}>
                {choice}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </React.Fragment>
  );
}
