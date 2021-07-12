import { connect } from 'react-redux';
import {
  IFirmwareCodePlace,
  IKeyboardsPhase,
  KeyboardsPhase,
  RootState,
} from '../../../store/state';
import EditDefinition from './EditDefinition';
import {
  KeyboardsAppActions,
  KeyboardsEditDefinitionActions,
} from '../../../actions/keyboards.actions';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    jsonFilename: state.keyboards.editdefinition.jsonFilename,
    keyboardDefinition: state.keyboards.editdefinition.keyboardDefinition,
    productName: state.keyboards.editdefinition.productName,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    jsonStr: state.keyboards.editdefinition.jsonString,
    agreement: state.keyboards.editdefinition.agreement,
    firmwareCodePlace: state.keyboards.editdefinition.firmwareCodePlace,
    forkedRepositoryUrl: state.keyboards.editdefinition.forkedRepositoryUrl,
    forkedRepositoryEvidence:
      state.keyboards.editdefinition.forkedRepositoryEvidence,
    otherPlaceHowToGet: state.keyboards.editdefinition.otherPlaceHowToGet,
    otherPlaceSourceCodeEvidence:
      state.keyboards.editdefinition.otherPlaceSourceCodeEvidence,
    otherPlacePublisherEvidence:
      state.keyboards.editdefinition.otherPlacePublisherEvidence,
    qmkRepositoryFirstPullRequestUrl:
      state.keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl,
    phase: state.keyboards.app.phase,
  };
};
export type EditKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateJsonFilename: (jsonFilename: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateJsonFilename(jsonFilename)
      );
    },
    updateJsonString: (jsonStr: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateJsonString(jsonStr));
    },
    updateKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateKeyboardDefinition(
          keyboardDefinition
        )
      );
    },
    updateProductName: (productName: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateProductName(productName));
    },
    saveAsDraft: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateKeyboardDefinitionAsDraft());
    },
    submitForReview: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateAndSubmitKeyboardDefinition());
    },
    updateJsonFile: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateKeyboardDefinitionJsonFile());
    },
    backToList: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    },
    delete: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.deleteKeyboardDefinition());
    },
    updateAgreement: (agreement: boolean) => {
      _dispatch(KeyboardsEditDefinitionActions.updateAgreement(agreement));
    },
    updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFirmwareCodePlace(
          firmwareCodePlace
        )
      );
    },
    updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateForkedRepositoryUrl(
          forkedRepositoryUrl
        )
      );
    },
    updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateForkedRepositoryEvidence(
          forkedRepositoryEvidence
        )
      );
    },
    updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateOtherPlaceHowToGet(
          otherPlaceHowToGet
        )
      );
    },
    updateOtherPlaceSourceCodeEvidence: (
      otherPlaceSourceCodeEvidence: string
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateOtherPlaceSourceCodeEvidence(
          otherPlaceSourceCodeEvidence
        )
      );
    },
    updateOtherPlacePublisherEvidence: (
      otherPlacePublisherEvidence: string
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateOtherPlacePublisherEvidence(
          otherPlacePublisherEvidence
        )
      );
    },
    updateQmkRepositoryFirstPullRequestUrl: (
      qmkRepositoryFirstPullRequest: string
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateQmkRepositoryFirstPullRequestUrl(
          qmkRepositoryFirstPullRequest
        )
      );
    },
    updatePhase: (phase: IKeyboardsPhase) => {
      _dispatch(KeyboardsAppActions.updatePhase(phase));
    },
  };
};
export type EditKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(EditDefinition);
