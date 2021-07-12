/* eslint-disable no-undef */
import React from 'react';
import './EditDefinition.scss';
import {
  EditKeyboardActionsType,
  EditKeyboardStateType,
} from './EditDefinition.container';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
} from '@material-ui/core';
import {
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { Alert } from '@material-ui/lab';
import moment from 'moment-timezone';
import { MoreVert } from '@material-ui/icons';
import {
  isForkedQmkFirmwareCode,
  isOtherFirmwareCode,
  isQmkFirmwareCode,
} from '../ValidationUtils';
import DefinitionForm from './DefinitionForm';
import CatalogForm from './CatalogForm.container';

type ConfirmDialogMode =
  | 'save_as_draft'
  | 'submit_for_review'
  | 'delete'
  | 'upload_json';

type EditKeyboardState = {
  openConfirmDialog: boolean;
  confirmDialogMode: ConfirmDialogMode | null;
  menuAnchorEl: any;
};
type OwnProps = {};
type EditKeyboardProps = OwnProps &
  Partial<EditKeyboardActionsType> &
  Partial<EditKeyboardStateType>;

const statusSteps: IKeyboardDefinitionStatus[] = [
  KeyboardDefinitionStatus.draft,
  KeyboardDefinitionStatus.in_review,
  KeyboardDefinitionStatus.approved,
];

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScZPhiXEG2VETCGZ2dYp4YbzzMlU62Crh1cNxPpFBkN4cCPbA/viewform?usp=pp_url&entry.661359702=${keyboard_name}&entry.135453541=${keyboard_id}';

export default class EditDefinition extends React.Component<
  EditKeyboardProps,
  EditKeyboardState
> {
  private refInputProductName: React.RefObject<HTMLInputElement>;
  constructor(props: EditKeyboardProps | Readonly<EditKeyboardProps>) {
    super(props);
    this.state = {
      openConfirmDialog: false,
      confirmDialogMode: null,
      menuAnchorEl: null,
    };
    this.refInputProductName = React.createRef<HTMLInputElement>();
  }

  private onLoadFile(
    keyboardDefinition: KeyboardDefinitionSchema,
    jsonFilename: string,
    jsonStr: string
  ) {
    this.props.updateJsonFilename!(jsonFilename);
    this.props.updateKeyboardDefinition!(keyboardDefinition);
    this.props.updateJsonString!(jsonStr);
    this.refInputProductName.current?.focus(); // TextField(Product Name) is the only editable field.
  }

  private isFilledInAllField(): boolean {
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        !!this.props.jsonFilename
      );
    } else {
      return !!this.props.productName && !!this.props.keyboardDefinition;
    }
  }

  private isFilledInAllFieldAndAgreed(): boolean {
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        !!this.props.jsonFilename
      );
    } else {
      let isFilledEvidence: boolean = false;
      if (isQmkFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence = !!this.props.qmkRepositoryFirstPullRequestUrl;
      } else if (isForkedQmkFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence =
          !!this.props.forkedRepositoryUrl &&
          !!this.props.forkedRepositoryEvidence;
      } else if (isOtherFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence =
          !!this.props.otherPlaceHowToGet &&
          !!this.props.otherPlaceSourceCodeEvidence &&
          !!this.props.otherPlacePublisherEvidence;
      }
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        this.props.agreement! &&
        isFilledEvidence
      );
    }
  }

  handleBackButtonClick = () => {
    location.href = '/keyboards';
  };

  handleSaveAsDraftButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'save_as_draft',
    });
  };

  handleSubmitForReviewButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'submit_for_review',
    });
  };

  handleUpdateJsonFileButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'upload_json',
    });
  };

  handleConfirmYesClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
    if (this.state.confirmDialogMode === 'upload_json') {
      this.props.updateJsonFile!();
    } else if (this.state.confirmDialogMode === 'save_as_draft') {
      this.props.saveAsDraft!();
    } else if (this.state.confirmDialogMode === 'submit_for_review') {
      this.props.submitForReview!();
    } else if (this.state.confirmDialogMode === 'delete') {
      this.props.delete!();
    }
  };

  handleConfirmNoClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
  };

  handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      menuAnchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      menuAnchorEl: null,
    });
  };

  handleDownloadJsonMenuClick = () => {
    this.setState({
      menuAnchorEl: null,
    });
    const jsonUrl = URL.createObjectURL(
      new Blob([this.props.jsonStr!], { type: 'application/json' })
    );
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = `${this.props.definitionDocument!.name}.json`;
    a.href = jsonUrl;
    a.click();
    a.remove();
  };

  handleDeleteMenuClick = () => {
    this.setState({
      menuAnchorEl: null,
      openConfirmDialog: true,
      confirmDialogMode: 'delete',
    });
  };

  isStatus(status: IKeyboardDefinitionStatus): boolean {
    return this.props.definitionDocument!.status === status;
  }

  onChangeTab(event: any, tabIndex: number) {
    if (tabIndex === 0) {
      this.props.updatePhase!('edit');
    } else if (tabIndex === 1) {
      this.props.updatePhase!('catalog');
    } else {
      throw new Error(`Invalid tabIndex: ${tabIndex}`);
    }
  }

  render() {
    let activeStep;
    switch (this.props.definitionDocument!.status) {
      case KeyboardDefinitionStatus.draft:
      case KeyboardDefinitionStatus.rejected:
        activeStep = 0;
        break;
      case KeyboardDefinitionStatus.in_review:
        activeStep = 1;
        break;
      case KeyboardDefinitionStatus.approved:
        activeStep = 2;
        break;
      default:
        throw new Error(
          `Unknown status: ${this.props.definitionDocument?.status}`
        );
    }
    const completed = activeStep === 2;
    return (
      <React.Fragment>
        <div className="edit-definition-wrapper">
          <div className="edit-definition-container">
            <div className="edit-definition-card">
              <Card>
                <CardContent>
                  <div className="edit-keyboard-header">
                    <Button
                      style={{ marginRight: '16px' }}
                      onClick={this.handleBackButtonClick}
                    >
                      &lt; Keyboard List
                    </Button>
                    <MenuUI
                      definitionDocument={this.props.definitionDocument!}
                      keyboardDefinition={this.props.keyboardDefinition}
                      handleDeleteMenuClick={this.handleDeleteMenuClick}
                      handleMenuClose={this.handleMenuClose}
                      handleDownloadJsonMenuClick={
                        this.handleDownloadJsonMenuClick
                      }
                      handleMenuIconClick={this.handleMenuIconClick}
                      menuAnchorEl={this.state.menuAnchorEl}
                    />
                  </div>
                  <Stepper activeStep={activeStep}>
                    {statusSteps.map((label) => {
                      const stepProps = {
                        completed,
                      };
                      const labelProps = {};
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <AlertMessage
                    definitionDocument={this.props.definitionDocument!}
                  />
                  {this.isStatus(KeyboardDefinitionStatus.approved) ? (
                    <div className="edit-keyboard-tabs">
                      <Tabs
                        value={this.props.phase === 'edit' ? 0 : 1}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.onChangeTab.bind(this)}
                        variant="fullWidth"
                        centered
                      >
                        <Tab label="Definition" />
                        <Tab label="Catalog" />
                      </Tabs>
                    </div>
                  ) : null}
                  {this.props.phase === 'edit' ? (
                    <DefinitionForm
                      definitionDocument={this.props.definitionDocument}
                      onLoadFile={this.onLoadFile.bind(this)}
                      jsonFilename={this.props.jsonFilename}
                      keyboardDefinition={this.props.keyboardDefinition}
                      productName={this.props.productName}
                      refInputProductName={this.refInputProductName}
                      updateProductName={this.props.updateProductName!}
                      firmwareCodePlace={this.props.firmwareCodePlace}
                      updateFirmwareCodePlace={
                        this.props.updateFirmwareCodePlace!
                      }
                      qmkRepositoryFirstPullRequestUrl={
                        this.props.qmkRepositoryFirstPullRequestUrl
                      }
                      updateQmkRepositoryFirstPullRequestUrl={
                        this.props.updateQmkRepositoryFirstPullRequestUrl!
                      }
                      forkedRepositoryUrl={this.props.forkedRepositoryUrl}
                      updateForkedRepositoryUrl={
                        this.props.updateForkedRepositoryUrl!
                      }
                      forkedRepositoryEvidence={
                        this.props.forkedRepositoryEvidence
                      }
                      updateForkedRepositoryEvidence={
                        this.props.updateForkedRepositoryEvidence!
                      }
                      otherPlaceHowToGet={this.props.otherPlaceHowToGet}
                      updateOtherPlaceHowToGet={
                        this.props.updateOtherPlaceHowToGet!
                      }
                      otherPlaceSourceCodeEvidence={
                        this.props.otherPlaceSourceCodeEvidence
                      }
                      updateOtherPlaceSourceCodeEvidence={
                        this.props.updateOtherPlaceSourceCodeEvidence!
                      }
                      otherPlacePublisherEvidence={
                        this.props.otherPlacePublisherEvidence
                      }
                      updateOtherPlacePublisherEvidence={
                        this.props.updateOtherPlacePublisherEvidence!
                      }
                      agreement={this.props.agreement}
                      updateAgreement={this.props.updateAgreement!}
                      handleSaveAsDraftButtonClick={this.handleSaveAsDraftButtonClick.bind(
                        this
                      )}
                      isFilledInAllField={this.isFilledInAllField.bind(this)}
                      handleSubmitForReviewButtonClick={this.handleSubmitForReviewButtonClick.bind(
                        this
                      )}
                      isFilledInAllFieldAndAgreed={this.isFilledInAllFieldAndAgreed.bind(
                        this
                      )}
                      handleUpdateJsonFileButtonClick={this.handleUpdateJsonFileButtonClick.bind(
                        this
                      )}
                    />
                  ) : null}
                  {this.props.phase === 'catalog' ? <CatalogForm /> : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.openConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Keyboard Registration'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              color={
                this.state.confirmDialogMode === 'delete'
                  ? 'secondary'
                  : 'initial'
              }
            >
              {this.state.confirmDialogMode === 'upload_json'
                ? 'Are you sure to update the JSON file?'
                : this.state.confirmDialogMode === 'save_as_draft'
                ? 'Are you sure to save this new keyboard as draft?'
                : this.state.confirmDialogMode === 'submit_for_review'
                ? 'Are you sure to register and submit this new keyboard for review?'
                : this.state.confirmDialogMode === 'delete'
                ? 'Are you sure to delete?'
                : ''}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              autoFocus
              onClick={this.handleConfirmNoClick}
            >
              No
            </Button>
            <Button color="primary" onClick={this.handleConfirmYesClick}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

type MenuUIProps = {
  keyboardDefinition: KeyboardDefinitionSchema | null | undefined;
  definitionDocument: IKeyboardDefinitionDocument;
  handleDownloadJsonMenuClick: () => void;
  handleDeleteMenuClick: () => void;
  // eslint-disable-next-line no-unused-vars
  handleMenuIconClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  menuAnchorEl: any;
};

function MenuUI(props: MenuUIProps) {
  const menuItems = [];
  if (props.keyboardDefinition) {
    menuItems.push(
      <MenuItem
        key="1"
        onClick={props.handleDownloadJsonMenuClick}
        button={true}
      >
        Download JSON
      </MenuItem>
    );
  }
  if (props.definitionDocument.status !== KeyboardDefinitionStatus.in_review) {
    menuItems.push(
      <MenuItem key="2" onClick={props.handleDeleteMenuClick} button={true}>
        Delete
      </MenuItem>
    );
  }
  if (menuItems.length > 0) {
    return (
      <React.Fragment>
        <IconButton
          aria-owns={props.menuAnchorEl ? 'edit-definition-menu' : undefined}
          onClick={props.handleMenuIconClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="edit-definition-menu"
          anchorEl={props.menuAnchorEl}
          open={Boolean(props.menuAnchorEl)}
          onClose={props.handleMenuClose}
        >
          {menuItems}
        </Menu>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

type AlertMessageProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function AlertMessage(props: AlertMessageProps) {
  const updatedAt = moment(props.definitionDocument.updatedAt).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return (
      <div className="edit-definition-alert">
        <Alert severity="info">
          Thank you for registering your keyboard! We have received your request
          at {updatedAt}.
        </Alert>
      </div>
    );
  } else if (
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    const googleFormUrl = GOOGLE_FORM_URL.replace(
      '${keyboard_name}',
      props.definitionDocument!.name
    ).replace('${keyboard_id}', props.definitionDocument!.id);
    return (
      <div className="edit-definition-alert">
        <Alert severity="error">
          Your request was rejected at {updatedAt}. Reason:{' '}
          {props.definitionDocument!.rejectReason}
          <br />
          If the review request submitted by you was rejected by the reason that
          the same keyboard definition has already been registered by the
          incorrect applicant, please report it from{' '}
          <a href={googleFormUrl} target="_blank" rel="noreferrer">
            this form
          </a>
          .
        </Alert>
      </div>
    );
  } else {
    return null;
  }
}
