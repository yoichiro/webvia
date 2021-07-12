import React, { useState } from 'react';
import {
  CatalogSearchActionsType,
  CatalogSearchStateType,
} from './CatalogSearch.container';
import './CatalogSearch.scss';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CardMedia,
} from '@material-ui/core';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_COUNT_TYPE,
  ALL_KEY_SWITCH_TYPE,
  ALL_LED_TYPE,
  ALL_MCU_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  CONDITION_NOT_SELECTED,
  IConditionNotSelected,
  IKeyboardFeatures,
  IKeyboardHotswapType,
  IKeyboardKeyCountType,
  IKeyboardKeySwitchType,
  IKeyboardLedType,
  IKeyboardMcuType,
  IKeyboardOledType,
  IKeyboardSpeakerType,
  IKeyboardSplitType,
  IKeyboardStaggeredType,
} from '../../../store/state';
import {
  getGitHubUserDisplayName,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import { Pagination } from '@material-ui/lab';
import appPackage from '../../../package.alias.json';

type CatalogSearchState = {};
type OwnProps = {};
type CatalogSearchProps = OwnProps &
  Partial<CatalogSearchActionsType> &
  Partial<CatalogSearchStateType>;

class CatalogSearch extends React.Component<
  CatalogSearchProps,
  CatalogSearchState
> {
  constructor(props: CatalogSearchProps | Readonly<CatalogSearchProps>) {
    super(props);
  }

  componentDidMount() {
    this.updateTitle();
  }

  private updateTitle() {
    document.title = appPackage.name;
  }

  onChangeKeyCount(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardKeyCountType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_COUNT_TYPE);
  }

  onChangeSplitType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardSplitType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPLIT_TYPE);
  }

  onChangeStaggeredType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardStaggeredType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_STAGGERED_TYPE);
  }

  onChangeLedType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardLedType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_LED_TYPE);
  }

  onChangeKeySwitchType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardKeySwitchType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_SWITCH_TYPE);
  }

  onChangeHotswapType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardHotswapType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_HOTSWAP_TYPE);
  }

  onChangeMcuType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardMcuType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_MCU_TYPE);
  }

  onChangeOledType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardOledType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_OLED_TYPE);
  }

  onChangeSpeakerType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardSpeakerType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPEAKER_TYPE);
  }

  onChangeKeyword(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateKeyword!(event.target.value);
  }

  onClickSearch() {
    this.props.search!();
  }

  onKeyDownKeyword(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      this.props.search!();
    }
  }

  onClickClear() {
    this.props.resetSearchConditions!();
  }

  render() {
    const getFeatureValue = (
      targetFeatures: readonly IKeyboardFeatures[]
    ): IKeyboardFeatures | IConditionNotSelected => {
      return (
        this.props.features!.find((feature) => {
          for (const target of targetFeatures) {
            if (feature === target) {
              return true;
            }
          }
          return false;
        }) || CONDITION_NOT_SELECTED
      );
    };
    return (
      <div className="catalog-search-wrapper">
        <div className="catalog-search-container">
          <Grid container>
            <Grid item sm={3}>
              <div className="catalog-search-condition-container">
                <div className="catalog-search-condition">
                  <TextField
                    label="Keyboard Name"
                    fullWidth={true}
                    value={this.props.keyword}
                    onChange={this.onChangeKeyword.bind(this)}
                    onKeyDown={this.onKeyDownKeyword.bind(this)}
                  />
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-key-count">
                      Number of Keys
                    </InputLabel>
                    <Select
                      labelId="catalog-search-key-count"
                      value={getFeatureValue(ALL_KEY_COUNT_TYPE)}
                      onChange={this.onChangeKeyCount.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="over_100">Over 100%</MenuItem>
                      <MenuItem value="100">100%</MenuItem>
                      <MenuItem value="80">80%</MenuItem>
                      <MenuItem value="60">60%</MenuItem>
                      <MenuItem value="40">40%</MenuItem>
                      <MenuItem value="30">30%</MenuItem>
                      <MenuItem value="macro">Macro</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-split">
                      Integrated/Split
                    </InputLabel>
                    <Select
                      labelId="catalog-search-split"
                      value={getFeatureValue(ALL_SPLIT_TYPE)}
                      onChange={this.onChangeSplitType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="integrated">Integrated</MenuItem>
                      <MenuItem value="split">Split</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-staggered">
                      Staggered
                    </InputLabel>
                    <Select
                      labelId="catalog-search-staggered"
                      value={getFeatureValue(ALL_STAGGERED_TYPE)}
                      onChange={this.onChangeStaggeredType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="row_staggered">Row Staggered</MenuItem>
                      <MenuItem value="column_staggered">
                        Column Staggered
                      </MenuItem>
                      <MenuItem value="ortholinear">Ortholinear</MenuItem>
                      <MenuItem value="symmetrical">Symmetrical</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-lighting">
                      Lighting
                    </InputLabel>
                    <Select
                      labelId="catalog-search-lighting"
                      value={getFeatureValue(ALL_LED_TYPE)}
                      onChange={this.onChangeLedType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="backlight">Backlight</MenuItem>
                      <MenuItem value="underglow">Underglow</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-key-switch">
                      Key Switch
                    </InputLabel>
                    <Select
                      labelId="catalog-search-key-switch"
                      value={getFeatureValue(ALL_KEY_SWITCH_TYPE)}
                      onChange={this.onChangeKeySwitchType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="cherry_mx">
                        Cherry MX Compatible
                      </MenuItem>
                      <MenuItem value="kailh_choc">Kailh Choc</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-hot-swap">
                      Hot Swap
                    </InputLabel>
                    <Select
                      labelId="catalog-search-hot-swap"
                      value={getFeatureValue(ALL_HOTSWAP_TYPE)}
                      onChange={this.onChangeHotswapType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="hot_swap">Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-mcu">
                      Micro Control Unit
                    </InputLabel>
                    <Select
                      labelId="catalog-search-mcu"
                      value={getFeatureValue(ALL_MCU_TYPE)}
                      onChange={this.onChangeMcuType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="at90usb1286">at90usb1286</MenuItem>
                      <MenuItem value="at90usb1287">at90usb1287</MenuItem>
                      <MenuItem value="at90usb646">at90usb646</MenuItem>
                      <MenuItem value="at90usb647">at90usb647</MenuItem>
                      <MenuItem value="atmega16u2">atmega16u2</MenuItem>
                      <MenuItem value="atmega16u4">atmega16u4</MenuItem>
                      <MenuItem value="atmega328p">atmega328p</MenuItem>
                      <MenuItem value="atmega32a">atmega32a</MenuItem>
                      <MenuItem value="atmega32u2">atmega32u2</MenuItem>
                      <MenuItem value="atmega32u4">atmega32u4</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-oled">OLED</InputLabel>
                    <Select
                      labelId="catalog-search-oled"
                      value={getFeatureValue(ALL_OLED_TYPE)}
                      onChange={this.onChangeOledType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="oled">Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-speaker">Speaker</InputLabel>
                    <Select
                      labelId="catalog-search-speaker"
                      value={getFeatureValue(ALL_SPEAKER_TYPE)}
                      onChange={this.onChangeSpeakerType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="speaker">Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-buttons">
                  <Button variant="text" onClick={this.onClickClear.bind(this)}>
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onClickSearch.bind(this)}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item sm={9}>
              <SearchResult definitionDocuments={this.props.searchResult!} />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default CatalogSearch;

const SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE = 5;

type SearchResultProps = {
  definitionDocuments: IKeyboardDefinitionDocument[];
};

function SearchResult(props: SearchResultProps) {
  const [offset, setOffset] = useState(0);

  const onChangePage = (event: any, page: number): void => {
    setOffset((page - 1) * SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE);
  };

  return (
    <div className="catalog-search-result-container">
      {props.definitionDocuments
        .slice(offset, offset + SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE)
        .map((result) => (
          <KeyboardCard
            definition={result}
            key={`search-result-${result.id}`}
          />
        ))}
      <div className="catalog-search-result-pagination">
        <Pagination
          count={Math.ceil(
            props.definitionDocuments.length /
              SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE
          )}
          page={Math.floor(offset / SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE) + 1}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

type KeyboardCardProps = {
  definition: IKeyboardDefinitionDocument;
};

function KeyboardCard(props: KeyboardCardProps) {
  const onClickCard = () => {
    location.href = `/catalog/${props.definition.id}`;
  };

  return (
    <Card className="catalog-search-result-card" onClick={onClickCard}>
      {props.definition.thumbnailImageUrl ? (
        <CardMedia
          image={props.definition.thumbnailImageUrl}
          className="catalog-search-result-card-image"
        />
      ) : null}
      <CardContent className="catalog-search-result-card-container">
        <div className="catalog-search-result-card-content">
          <div className="catalog-search-result-card-header">
            <div className="catalog-search-result-card-header-name-container">
              <h2 className="catalog-search-result-card-name">
                {props.definition.name}
              </h2>
              <Typography variant="caption">
                {getGitHubUserDisplayName(props.definition)}
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
