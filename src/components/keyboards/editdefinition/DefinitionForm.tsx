import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React from 'react';
import {
  IKeyboardDefinitionDocument,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { FirmwareCodePlace, IFirmwareCodePlace } from '../../../store/state';
import { AgreementCheckbox } from '../agreement/AgreementCheckbox';
import './DefinitionForm.scss';

type DefinitionFormProps = {
  definitionDocument: IKeyboardDefinitionDocument | null | undefined;
  onLoadFile: (
    // eslint-disable-next-line no-unused-vars
    keyboardDefinition: KeyboardDefinitionSchema,
    // eslint-disable-next-line no-unused-vars
    jsonFilename: string,
    // eslint-disable-next-line no-unused-vars
    jsonStr: string
  ) => void;
  jsonFilename?: string;
  keyboardDefinition: KeyboardDefinitionSchema | null | undefined;
  productName?: string;
  refInputProductName: any;
  // eslint-disable-next-line no-unused-vars
  updateProductName: (productName: string) => void;
  firmwareCodePlace?: IFirmwareCodePlace;
  // eslint-disable-next-line no-unused-vars
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => void;
  qmkRepositoryFirstPullRequestUrl?: string;
  updateQmkRepositoryFirstPullRequestUrl: (
    // eslint-disable-next-line no-unused-vars
    qmkRepositoryFirstPullRequestUrl: string
  ) => void;
  forkedRepositoryUrl?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => void;
  forkedRepositoryEvidence?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => void;
  otherPlaceHowToGet?: string;
  // eslint-disable-next-line no-unused-vars
  updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => void;
  otherPlaceSourceCodeEvidence?: string;
  updateOtherPlaceSourceCodeEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlaceSourceCodeEvidence: string
  ) => void;
  otherPlacePublisherEvidence?: string;
  updateOtherPlacePublisherEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlacePublisherEvidence: string
  ) => void;
  agreement?: boolean;
  // eslint-disable-next-line no-unused-vars
  updateAgreement: (agreement: boolean) => void;
  handleSaveAsDraftButtonClick: () => void;
  isFilledInAllField: () => boolean;
  handleSubmitForReviewButtonClick: () => void;
  isFilledInAllFieldAndAgreed: () => boolean;
  handleUpdateJsonFileButtonClick: () => void;
};

export default function DefinitionForm(props: DefinitionFormProps) {
  return (
    <div className="edit-definition-form-container">
      <JsonUploadForm
        definitionDocument={props.definitionDocument!}
        onLoadFile={props.onLoadFile}
      />
      <div className="edit-definition-form">
        <JsonFilenameRow
          definitionDocument={props.definitionDocument!}
          jsonFilename={props.jsonFilename}
        />
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-name"
            label="Name"
            variant="outlined"
            value={props.keyboardDefinition?.name || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-vendor_id"
            label="Vendor ID"
            variant="outlined"
            value={props.keyboardDefinition?.vendorId || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-product_id"
            label="Product ID"
            variant="outlined"
            value={props.keyboardDefinition?.productId || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <ProductNameRow
          definitionDocument={props.definitionDocument!}
          productName={props.productName}
          refInputProductName={props.refInputProductName}
          updateProductName={props.updateProductName}
        />
        <FirmwareCodePlaceField
          definitionDocument={props.definitionDocument!}
          firmwareCodePlace={props.firmwareCodePlace}
          updateFirmwareCodePlace={props.updateFirmwareCodePlace}
        />
        <EvidenceForQmkRepository
          firmwareCodePlace={props.firmwareCodePlace}
          definitionDocument={props.definitionDocument!}
          qmkRepositoryFirstPullRequestUrl={
            props.qmkRepositoryFirstPullRequestUrl
          }
          updateQmkRepositoryFirstPullRequestUrl={
            props.updateQmkRepositoryFirstPullRequestUrl
          }
        />
        <EvidenceForForkedRepository
          definitionDocument={props.definitionDocument!}
          firmwareCodePlace={props.firmwareCodePlace}
          forkedRepositoryUrl={props.forkedRepositoryUrl}
          updateForkedRepositoryUrl={props.updateForkedRepositoryUrl}
          forkedRepositoryEvidence={props.forkedRepositoryEvidence}
          updateForkedRepositoryEvidence={props.updateForkedRepositoryEvidence}
        />
        <EvidenceForOtherPlace
          definitionDocument={props.definitionDocument!}
          firmwareCodePlace={props.firmwareCodePlace}
          otherPlaceHowToGet={props.otherPlaceHowToGet}
          updateOtherPlaceHowToGet={props.updateOtherPlaceHowToGet}
          otherPlaceSourceCodeEvidence={props.otherPlaceSourceCodeEvidence}
          updateOtherPlaceSourceCodeEvidence={
            props.updateOtherPlaceSourceCodeEvidence
          }
          otherPlacePublisherEvidence={props.otherPlacePublisherEvidence}
          updateOtherPlacePublisherEvidence={
            props.updateOtherPlacePublisherEvidence
          }
        />
        <AgreementRow
          definitionDocument={props.definitionDocument!}
          agreement={props.agreement!}
          updateAgreement={props.updateAgreement!}
        />
        <div className="edit-definition-form-buttons">
          <SaveAsDraftButton
            definitionDocument={props.definitionDocument!}
            handleSaveAsDraftButtonClick={props.handleSaveAsDraftButtonClick}
            isFilledInAllField={props.isFilledInAllField}
          />
          <SubmitForReviewButton
            definitionDocument={props.definitionDocument!}
            handleSubmitForReviewButtonClick={
              props.handleSubmitForReviewButtonClick
            }
            isFilledInAllFieldAndAgreed={props.isFilledInAllFieldAndAgreed}
          />
          <UpdateJsonButton
            definitionDocument={props.definitionDocument!}
            handleUpdateJsonFileButtonClick={
              props.handleUpdateJsonFileButtonClick
            }
            isFilledInAllField={props.isFilledInAllField}
          />
        </div>
        <div className="edit-definition-form-notice">
          <p>
            * You can submit the JSON file written by you only. Do NOT infringe
            of the right of person who created the original JSON file. We check
            whether you are valid author of the keyboard you request in our
            review process, but notice that we can&quot;t insure the validity
            completely.
          </p>
          <p>
            * We check whether the keyboard you request has a unique combination
            of the Vendor ID, Product ID and Product Name in our review process.
          </p>
        </div>
      </div>
    </div>
  );
}

type JsonUploadFormProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  onLoadFile: (
    // eslint-disable-next-line no-unused-vars
    kb: KeyboardDefinitionSchema,
    // eslint-disable-next-line no-unused-vars
    name: string,
    // eslint-disable-next-line no-unused-vars
    jsonStr: string
  ) => void;
};

function JsonUploadForm(props: JsonUploadFormProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return null;
  } else if (
    props.definitionDocument.status === KeyboardDefinitionStatus.approved
  ) {
    return (
      <div className="edit-definition-upload-form">
        <KeyboardDefinitionFormPart
          messageHtml={`<span class="edit-definition-upload-msg">Please import your file (.json)</b>`}
          validateDeviceIds={true}
          deviceVendorId={props.definitionDocument.vendorId}
          deviceProductId={props.definitionDocument.productId}
          size="small"
          onLoadFile={(kd, name, jsonStr) => {
            props.onLoadFile(kd, name, jsonStr);
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="edit-definition-upload-form">
        <KeyboardDefinitionFormPart
          messageHtml={`<span class="edit-definition-upload-msg">Please import your file (.json)</b>`}
          validateDeviceIds={false}
          size="small"
          onLoadFile={(kd, name, jsonStr) => {
            props.onLoadFile(kd, name, jsonStr);
          }}
        />
      </div>
    );
  }
}

type JsonFilenameRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  jsonFilename?: string;
};

function JsonFilenameRow(props: JsonFilenameRowProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return null;
  } else {
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-json-filename"
          label="JSON Filename"
          variant="outlined"
          value={props.jsonFilename}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
}

type ProductNameRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  productName?: string;
  refInputProductName: any;
  // eslint-disable-next-line no-unused-vars
  updateProductName: (productName: string) => void;
};

function ProductNameRow(props: ProductNameRowProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.in_review ||
    props.definitionDocument.status === KeyboardDefinitionStatus.approved
  ) {
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-product-name"
          label="Product Name"
          helperText="This is a Product Name specified by `#define PRODUCT [Product Name]` in the config.h file."
          variant="outlined"
          value={props.productName}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="edit-definition-form-row">
        <TextField
          inputRef={props.refInputProductName}
          id="edit-definition-product-name"
          label="Product Name"
          helperText="This is a Product Name specified by `#define PRODUCT [Product Name]` in the config.h file."
          variant="outlined"
          required={true}
          value={props.productName}
          onChange={(event) => props.updateProductName(event.target.value)}
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>
    );
  }
}

type FirmwareCodePlaceFieldProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  firmwareCodePlace?: IFirmwareCodePlace;
  // eslint-disable-next-line no-unused-vars
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => void;
};

function FirmwareCodePlaceField(props: FirmwareCodePlaceFieldProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <div className="edit-definition-form-row">
        <FormControl>
          <InputLabel id="edit-definition-firmware-code-place">
            Where is the source code of this keyboard&apos;s firmware?
          </InputLabel>
          <Select
            labelId="edit-definition-firmware-code-place"
            value={props.firmwareCodePlace}
            onChange={(e) =>
              props.updateFirmwareCodePlace(
                e.target.value as IFirmwareCodePlace
              )
            }
          >
            <MenuItem value={FirmwareCodePlace.qmk}>
              GitHub: qmk/qmk_firmware
            </MenuItem>
            <MenuItem value={FirmwareCodePlace.forked}>
              GitHub: Your forked repository from qmk/qmk_firmware
            </MenuItem>
            <MenuItem value={FirmwareCodePlace.other}>Other</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  } else {
    const value =
      props.firmwareCodePlace === FirmwareCodePlace.qmk
        ? 'GitHub: qmk/qmk_firmware'
        : props.firmwareCodePlace === FirmwareCodePlace.forked
        ? 'GitHub: Your forked repository from qmk/qmk_firmware'
        : props.firmwareCodePlace === FirmwareCodePlace.other
        ? 'Other'
        : 'Unknown';
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-firmware-code-place"
          label="Where is the source code of this keyboard's firmware?"
          variant="outlined"
          value={value}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
}

type EvidenceForQmkRepositoryProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  definitionDocument: IKeyboardDefinitionDocument;
  qmkRepositoryFirstPullRequestUrl?: string;
  updateQmkRepositoryFirstPullRequestUrl: (
    // eslint-disable-next-line no-unused-vars
    qmkRepositoryFirstPullRequestUrl: string
  ) => void;
};

function EvidenceForQmkRepository(props: EvidenceForQmkRepositoryProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.qmk) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-qmk-repository-pull-request-url"
            label="1st Pull Request URL"
            variant="outlined"
            helperText="Fill in the URL of 1st Pull Request to the QMK Firmware repository which you submitted for this keyboard. This information will be confirmed by reviewers."
            value={props.qmkRepositoryFirstPullRequestUrl || ''}
            onChange={(e) =>
              props.updateQmkRepositoryFirstPullRequestUrl!(e.target.value)
            }
          />
        </div>
      );
    } else {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-qmk-repository-pull-request-url"
            label="1st Pull Request URL"
            variant="outlined"
            value={props.qmkRepositoryFirstPullRequestUrl || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      );
    }
  } else {
    return null;
  }
}

type EvidenceForForkedRepositoryProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  definitionDocument: IKeyboardDefinitionDocument;
  forkedRepositoryUrl?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => void;
  forkedRepositoryEvidence?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => void;
};

function EvidenceForForkedRepository(props: EvidenceForForkedRepositoryProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.forked) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-url"
              label="Forked Repository URL"
              variant="outlined"
              value={props.forkedRepositoryUrl || ''}
              onChange={(e) => props.updateForkedRepositoryUrl(e.target.value)}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-evidence"
              label="Evidence Information"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether the forked repository is the original and authentic firmware. This information will be confirmed by reviewers."
              value={props.forkedRepositoryEvidence || ''}
              onChange={(e) =>
                props.updateForkedRepositoryEvidence(e.target.value)
              }
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-url"
              label="Forked Repository URL"
              variant="outlined"
              value={props.forkedRepositoryUrl || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="create-definition-form-row">
            <TextField
              id="create-definition-forked-repository-evidence"
              label="Evidence Information"
              variant="outlined"
              multiline
              rows={4}
              value={props.forkedRepositoryEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </React.Fragment>
      );
    }
  } else {
    return null;
  }
}

type EvidenceForOtherPlaceProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  firmwareCodePlace?: IFirmwareCodePlace;
  otherPlaceHowToGet?: string;
  // eslint-disable-next-line no-unused-vars
  updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => void;
  otherPlaceSourceCodeEvidence?: string;
  updateOtherPlaceSourceCodeEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlaceSourceCodeEvidence: string
  ) => void;
  otherPlacePublisherEvidence?: string;
  updateOtherPlacePublisherEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlacePublisherEvidence: string
  ) => void;
};

function EvidenceForOtherPlace(props: EvidenceForOtherPlaceProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.other) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-how-to-get"
              label="How to Get the Source Code"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in how to get the source code of this keyboard's firmware."
              value={props.otherPlaceHowToGet || ''}
              onChange={(e) => props.updateOtherPlaceHowToGet(e.target.value)}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-source-code-evidence"
              label="Evidence Information for Source Code"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether the source code is the original and authentic firmware. This information will be confirmed by reviewers."
              value={props.otherPlaceSourceCodeEvidence || ''}
              onChange={(e) =>
                props.updateOtherPlaceSourceCodeEvidence(e.target.value)
              }
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-publisher-evidence"
              label="Evidence Information for Publisher"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether you are the publisher of the source code of the keyboard's firmware. This information will be confirmed by reviewers."
              value={props.otherPlacePublisherEvidence || ''}
              onChange={(e) =>
                props.updateOtherPlacePublisherEvidence(e.target.value)
              }
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-how-to-get"
              label="How to Get the Source Code"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlaceHowToGet || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-source-code-evidence"
              label="Evidence Information for Source Code"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlaceSourceCodeEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-publisher-evidence"
              label="Evidence Information for Publisher"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlacePublisherEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </React.Fragment>
      );
    }
  } else {
    return null;
  }
}

type AgreementRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  agreement: boolean;
  // eslint-disable-next-line no-unused-vars
  updateAgreement: (agreement: boolean) => void;
};

function AgreementRow(props: AgreementRowProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <div className="edit-definition-form-row">
        <AgreementCheckbox
          agreement={props.agreement}
          updateAgreement={props.updateAgreement}
        />
      </div>
    );
  } else {
    return null;
  }
}

type SaveAsDraftButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleSaveAsDraftButtonClick: () => void;
  isFilledInAllField: () => boolean;
};

function SaveAsDraftButton(props: SaveAsDraftButtonProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <Button
        color="primary"
        style={{ marginRight: '16px' }}
        onClick={props.handleSaveAsDraftButtonClick}
        disabled={!props.isFilledInAllField}
      >
        Save as Draft
      </Button>
    );
  } else {
    return null;
  }
}

type SubmitForReviewButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleSubmitForReviewButtonClick: () => void;
  isFilledInAllFieldAndAgreed: () => boolean;
};

function SubmitForReviewButton(props: SubmitForReviewButtonProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={props.handleSubmitForReviewButtonClick}
        disabled={!props.isFilledInAllFieldAndAgreed()}
      >
        Submit for Review
      </Button>
    );
  } else {
    return null;
  }
}

type UpdateJsonButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleUpdateJsonFileButtonClick: () => void;
  isFilledInAllField: () => boolean;
};

function UpdateJsonButton(props: UpdateJsonButtonProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.approved) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={props.handleUpdateJsonFileButtonClick}
        disabled={!props.isFilledInAllField()}
      >
        Update JSON file
      </Button>
    );
  } else {
    return null;
  }
}
