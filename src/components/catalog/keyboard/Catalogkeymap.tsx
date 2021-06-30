import './CatalogKeymap.scss';
import React from 'react';
import {
  CatalogKeymapActionsType,
  CatalogKeymapStateType,
} from './CatalogKeymap.container';
import KeyboardModel from '../../../models/KeyboardModel';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/Hid';
import { MOD_LEFT } from '../../../services/hid/Composition';
import Keycap from '../../configure/keycap/Keycap';
import {
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { getGitHubUserName } from '../../../services/storage/Storage';

type CatalogKeymapState = {};
type OwnProps = {};
type CatalogKeymapProps = OwnProps &
  Partial<CatalogKeymapActionsType> &
  Partial<CatalogKeymapStateType>;

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
};

export default class CatalogKeymap extends React.Component<
  CatalogKeymapProps,
  CatalogKeymapState
> {
  constructor(props: CatalogKeymapProps | Readonly<CatalogKeymapProps>) {
    super(props);
  }

  onChangeTab(event: React.ChangeEvent<{}>, value: number) {
    if (value === 0) {
      history.pushState(
        null,
        'Remap',
        `/catalog/${this.props.definitionDocument!.id}`
      );
      this.props.goToIntroduction!();
    }
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: React.MouseEvent<{}>) {
    history.pushState(null, 'Remap', '/catalog');
    this.props.goToSearch!();
  }

  render() {
    const kbd = new KeyboardModel(
      this.props.keyboardDefinition!.layouts.keymap
    );
    const { keymaps, width, height, left, top } = kbd.getKeymap();

    const marginLeft = left != 0 ? -left : 0;
    const marginTop = -top;
    const keycaps: KeycapData[] = [];
    keymaps.forEach((model: KeyModel) => {
      const keymap: IKeymap = {
        isAny: true,
        code: 0,
        kinds: [],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          label: model.pos,
          code: 0,
          name: { long: '', short: '' },
        },
      };
      const remap = null;
      keycaps.push({ model, keymap, remap });
    });
    return (
      <div className="catalog-keymap-container-wrapper">
        <div className="catalog-keymap-container">
          <Tabs
            variant="fullWidth"
            centered
            value={1}
            indicatorColor="primary"
            className="catalog-keymap-tabs"
            onChange={this.onChangeTab.bind(this)}
          >
            <Tab label="Introduction" />
            <Tab label="Keymap" />
          </Tabs>
          <Card className="catalog-keymap-header" variant="outlined">
            <CardContent className="catalog-keymap-header-row">
              <div>
                <Typography variant="h1">
                  {this.props.definitionDocument!.name}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle1">
                  designed by{' '}
                  {getGitHubUserName(this.props.definitionDocument!)}
                </Typography>
              </div>
            </CardContent>
          </Card>
          <div className="catalog-keymap-wrapper">
            <div
              className="catalog-keymap-keyboards"
              style={{ margin: '0 auto' }}
            >
              <div
                className="catalog-keymap-keyboard-root"
                style={{
                  width: width + 40,
                  height: height + 40,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderStyle: 'solid',
                }}
              >
                <div
                  className="catalog-keymap-keyboard-frame"
                  style={{
                    width: width,
                    height: height,
                    left: marginLeft,
                    top: marginTop,
                  }}
                >
                  {keycaps.map((keycap: KeycapData) => {
                    return keycap.model.isDecal ? (
                      ''
                    ) : (
                      <Keycap
                        debug={false}
                        key={keycap.model.pos}
                        selectedLayer={0}
                        onClickKeycap={() => {}}
                        {...keycap}
                        focus={false}
                        down={false}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="catalog-keymap-nav">
            <Button
              style={{ marginRight: '16px' }}
              onClick={this.onClickBackButton.bind(this)}
            >
              &lt; Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }
}