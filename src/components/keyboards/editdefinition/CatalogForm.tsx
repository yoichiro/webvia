import React, { useState } from 'react';
import './CatalogForm.scss';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  CircularProgressProps,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_COUNT_TYPE,
  ALL_MCU_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  CONDITION_NOT_SELECTED,
  IKeyboardFeatures,
} from '../../../store/state';
import {
  CatalogFormActionsType,
  CatalogFormStateType,
} from './CatalogForm.container';
import { Delete } from '@material-ui/icons';
import StoreAddDialog from './StoreAddDialog';
import { IStore } from '../../../services/storage/Storage';

type OwnProps = {};
type CatalogFormProps = OwnProps &
  Partial<CatalogFormActionsType> &
  Partial<CatalogFormStateType>;

export default function CatalogForm(props: CatalogFormProps) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [dragging, setDragging] = useState<boolean>(false);
  const [openStoreAddDialog, setOpenStoreAddDialog] = useState<boolean>(false);

  const getFeatureValue = (features: readonly string[]): string => {
    for (const feature of props.features!) {
      if (features.includes(feature)) {
        return feature;
      }
    }
    return CONDITION_NOT_SELECTED;
  };

  const hasFeatureValue = (feature: IKeyboardFeatures): boolean => {
    return props.features!.includes(feature);
  };

  const onChangeKeyCount = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_KEY_COUNT_TYPE
    );
  };

  const onChangeKeyboardType = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_SPLIT_TYPE
    );
  };

  const onChangeKeyLayout = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_STAGGERED_TYPE
    );
  };

  const onChangeBacklight = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'backlight' : CONDITION_NOT_SELECTED, [
      'backlight',
    ]);
  };

  const onChangeUnderglow = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'underglow' : CONDITION_NOT_SELECTED, [
      'underglow',
    ]);
  };

  const onChangeCherryMx = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'cherry_mx' : CONDITION_NOT_SELECTED, [
      'cherry_mx',
    ]);
  };

  const onChangeKailhChoc = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'kailh_choc' : CONDITION_NOT_SELECTED, [
      'kailh_choc',
    ]);
  };

  const onChangeHotSwap = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_HOTSWAP_TYPE
    );
  };

  const onChangeMcu = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(event.target.value as IKeyboardFeatures, ALL_MCU_TYPE);
  };

  const onChangeOled = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_OLED_TYPE
    );
  };

  const onChangeSpeaker = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_SPEAKER_TYPE
    );
  };

  const onClickSave = (): void => {
    props.save!();
  };

  const onDragOverFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const onDragLeaveFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const onDropFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    props.uploadKeyboardCatalogImage!(props.definitionDocument!.id, file);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;
    props.updateDescription!(description);
  };

  // eslint-disable-next-line no-unused-vars
  const onClickAddStore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenStoreAddDialog(true);
  };

  const onCloseStoreAddDialog = () => {
    setOpenStoreAddDialog(false);
  };

  const onAddStore = (name: string, url: string) => {
    const filtered = props.stores!.filter((store) => store.name !== name);
    filtered.push({
      name,
      url,
    });
    props.updateStores!(filtered);
  };

  const onClickDeleteStore = (store: IStore) => {
    const filtered = props.stores!.filter((x) => x.name !== store.name);
    props.updateStores!(filtered);
  };

  const onChangeWebsiteUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const websiteUrl = event.target.value;
    props.updateWebsiteUrl!(websiteUrl);
  };

  return (
    <div className="edit-definition-catalog-form-container">
      <div className="edit-definition-catalog-form">
        <div className="edit-definition-catalog-form-row">
          <TextField
            label="Name"
            variant="outlined"
            value={props.definitionDocument!.name || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="edit-definition-catalog-form-row">
          <Card variant="outlined">
            <CardContent>
              <div className="edit-definition-catalog-form-upload-image-form">
                {props.uploading ? (
                  <div className="edit-definition-catalog-form-upload-image-form-progress">
                    <CircularProgressWithLabel value={props.uploadedRate!} />
                  </div>
                ) : (
                  <React.Fragment>
                    <div
                      className={
                        dragging
                          ? 'edit-definition-catalog-form-upload-image-form-area edit-definition-catalog-form-upload-image-form-area-active'
                          : 'edit-definition-catalog-form-upload-image-form-area'
                      }
                      onDragOver={onDragOverFile}
                      onDrop={onDropFile}
                      onDragLeave={onDragLeaveFile}
                    >
                      <div
                        className="edit-definition-catalog-form-upload-image-form-message"
                        ref={dropTargetRef}
                      >
                        Drag image here
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <div className="edit-definition-catalog-form-upload-image-form-thumbnail">
                  <img src={props.definitionDocument!.thumbnailImageUrl} />
                </div>
                <div className="edit-definition-catalog-form-upload-image-form-image">
                  <img src={props.definitionDocument!.imageUrl} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="edit-definition-catalog-form-row">
          <Card variant="outlined">
            <CardContent>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={props.description}
                    onChange={onChangeDescription}
                  />
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <TextField
                    label="Keyboard Website URL"
                    variant="outlined"
                    value={props.websiteUrl}
                    onChange={onChangeWebsiteUrl}
                  />
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Number of Keys</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_KEY_COUNT_TYPE)}
                    onChange={onChangeKeyCount}
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
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Keyboard Type</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_SPLIT_TYPE)}
                    onChange={onChangeKeyboardType}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="integrated">Integrated</MenuItem>
                    <MenuItem value="split">Split</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Key Layout</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_STAGGERED_TYPE)}
                    onChange={onChangeKeyLayout}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="column_staggered">
                      Column Staggered
                    </MenuItem>
                    <MenuItem value="row_staggered">Row Staggered</MenuItem>
                    <MenuItem value="ortholinear">Ortholinear</MenuItem>
                    <MenuItem value="symmetrical">Symmetrical</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Lighting</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="backlight"
                          checked={hasFeatureValue('backlight')}
                          onChange={onChangeBacklight}
                        />
                      }
                      label="Backlight LED"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="underglow"
                          checked={hasFeatureValue('underglow')}
                          onChange={onChangeUnderglow}
                        />
                      }
                      label="Underglow LED"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Key Switch</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="cherryMx"
                          checked={hasFeatureValue('cherry_mx')}
                          onChange={onChangeCherryMx}
                        />
                      }
                      label="Cherry MX Compatible"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="kailhChoc"
                          checked={hasFeatureValue('kailh_choc')}
                          onChange={onChangeKailhChoc}
                        />
                      }
                      label="Kailh Choc"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Hot Swap</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_HOTSWAP_TYPE)}
                    onChange={onChangeHotSwap}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="hot_swap">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">MCU</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_MCU_TYPE)}
                    onChange={onChangeMcu}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="at90usb1286">at90usb1286</MenuItem>
                    <MenuItem value="at90usb1287">at90usb1287</MenuItem>
                    <MenuItem value="at90usb646">at90usb646</MenuItem>
                    <MenuItem value="at90usb647">at90usb647</MenuItem>
                    <MenuItem value="atmega16u2">atmega16u2</MenuItem>
                    <MenuItem value="atmega16u4">atmega16u4</MenuItem>
                    <MenuItem value="atmega328p">atmega328p</MenuItem>
                    <MenuItem value="atmega32u2">atmega32u2</MenuItem>
                    <MenuItem value="atmega32u4">atmega32u4</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">OLED</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_OLED_TYPE)}
                    onChange={onChangeOled}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="oled">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Speaker</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_SPEAKER_TYPE)}
                    onChange={onChangeSpeaker}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="speaker">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '16px' }}
                  onClick={onClickSave}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="edit-definition-catalog-form-row">
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Stores</Typography>
              <List>
                {props.stores!.map((store, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={store.name}
                      secondary={
                        <a href={store.url} target="_blank" rel="noreferrer">
                          {store.url}
                        </a>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        // eslint-disable-next-line no-unused-vars
                        onClick={(event: React.MouseEvent) => {
                          onClickDeleteStore(store);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <div className="edit-definition-catalog-form-store-form">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickAddStore}
                >
                  Add
                </Button>
                <StoreAddDialog
                  open={openStoreAddDialog}
                  onClose={onCloseStoreAddDialog}
                  onAdd={onAddStore}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
