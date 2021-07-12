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
import Keycap from '../../configure/keycap/Keycap.container';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import {
  AbstractKeymapData,
  getGitHubUserDisplayName,
} from '../../../services/storage/Storage';
import CatalogKeymapToolbar from './CatalogKeymapToolbar.container';
import { KeyLabelLangs } from '../../../services/labellang/KeyLabelLangs';

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

  onClickApplySharedKeymapData(savedKeymapData: AbstractKeymapData) {
    this.props.applySharedKeymapData!(savedKeymapData);
    history.pushState(
      null,
      'Remap',
      `/catalog/${this.props.definitionDocument!.id}/keymap?id=${
        savedKeymapData.id
      }`
    );
  }

  render() {
    const kbd = new KeyboardModel(
      this.props.keyboardDefinition!.layouts.keymap
    );
    const { keymaps, width, height, left, top } = kbd.getKeymap(
      this.props.selectedKeyboardOptions
    );

    const marginLeft = left != 0 ? -left : 0;
    const marginTop = -top;
    const keycaps: KeycapData[] = [];
    keymaps.forEach((model: KeyModel) => {
      let keymap: IKeymap;
      if (this.props.keymaps && this.props.keymaps.length > 0) {
        keymap = this.props.keymaps![this.props.selectedLayer!][model.pos];
      } else {
        keymap = {
          isAny: false,
          code: 0,
          kinds: [],
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: {
            label: '',
            code: 0,
            name: { long: '', short: '' },
          },
        };
      }
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
                  {getGitHubUserDisplayName(this.props.definitionDocument!)}
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
                        {...keycap}
                        focus={false}
                        down={false}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <CatalogKeymapToolbar
              onClickApplySharedKeymapData={this.onClickApplySharedKeymapData.bind(
                this
              )}
            />
          </div>
          {this.props.keymaps!.length > 0 ? (
            <div className="catalog-keymap-option-container">
              <div className="catalog-keymap-option-lang">
                <Typography variant="subtitle1">
                  {
                    KeyLabelLangs.KeyLabelLangMenus.find(
                      (m) => m.labelLang === this.props.langLabel
                    )!.menuLabel
                  }
                </Typography>
              </div>
              <Layer
                layerCount={this.props.keymaps!.length}
                selectedLayer={this.props.selectedLayer!}
                onClickLayer={this.props.updateSelectedLayer!}
              />
            </div>
          ) : null}
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

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
};

function Layer(props: LayerProps) {
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  return (
    <div className="catalog-keymap-layer-wrapper">
      {layers.map((layer) => {
        return (
          <Chip
            key={layer}
            variant="outlined"
            size="medium"
            label={layer}
            color={props.selectedLayer === layer ? 'primary' : undefined}
            clickable={props.selectedLayer !== layer}
            onClick={() => {
              props.onClickLayer(layer);
            }}
            className={
              props.selectedLayer !== layer
                ? 'catalog-keymap-layer-unselected'
                : 'catalog-keymap-layer-selected'
            }
          />
        );
      })}
    </div>
  );
}
