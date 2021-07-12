import {
  IConditionNotSelected,
  IFirmwareCodePlace,
  IKeyboardFeatures,
  IKeyboardsPhase,
  KeyboardsPhase,
  RootState,
} from '../store/state';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import {
  IKeyboardDefinitionDocument,
  IStore,
} from '../services/storage/Storage';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const KEYBOARDS_APP_ACTIONS = '@FIXME!App'; // FIXME!
export const KEYBOARDS_APP_UPDATE_PHASE = `${KEYBOARDS_APP_ACTIONS}/UpdatePhase`;
export const KeyboardsAppActions = {
  updatePhase: (phase: IKeyboardsPhase) => {
    return {
      type: KEYBOARDS_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

export const KEYBOARDS_CREATE_DEFINITION_ACTIONS = '@FIXME!CreateDefinition'; // FIXME!
export const KEYBOARDS_CREATE_DEFINITION_CLEAR = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/Clear`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateJsonFilename`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateJsonString`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateKeyboardDefinition`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateProductName`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_AGREEMENT = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateAgreement`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/FirmwareCodePlace`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_URL = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/ForkedRepositoryUrl`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/ForkedRepositoryEvidence`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/OtherPlaceHowToGet`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/OtherPlaceSourceCodeEvidence`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/OtherPlacePublisherEvidence`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/QmkRepositoryFirstPullRequestUrl`;
export const KeyboardsCreateDefinitionActions = {
  clear: () => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_CLEAR,
    };
  },
  updateJsonFilename: (jsonFilename: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME,
      value: jsonFilename,
    };
  },
  updateJsonString: (jsonStr: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING,
      value: jsonStr,
    };
  },
  updateKeyboardDefinition: (keyboardDefinition: KeyboardDefinitionSchema) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateProductName: (productName: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME,
      value: productName,
    };
  },
  updateAgreement: (agreement: boolean) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_AGREEMENT,
      value: agreement,
    };
  },
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE,
      value: firmwareCodePlace,
    };
  },
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_URL,
      value: forkedRepositoryUrl,
    };
  },
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE,
      value: forkedRepositoryEvidence,
    };
  },
  updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET,
      value: otherPlaceHowToGet,
    };
  },
  updateOtherPlaceSourceCodeEvidence: (
    otherPlaceSourceCodeEvidence: string
  ) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE,
      value: otherPlaceSourceCodeEvidence,
    };
  },
  updateOtherPlacePublisherEvidence: (otherPlacePublisherEvidence: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE,
      value: otherPlacePublisherEvidence,
    };
  },
  updateQmkRepositoryFirstPullRequestUrl: (
    qmkRepositoryFirstPullRequestUrl: string
  ) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL,
      value: qmkRepositoryFirstPullRequestUrl,
    };
  },
};

export const KEYBOARDS_EDIT_DEFINITION_ACTIONS = '@FIXME!EditDefinition'; // FIXME!
export const KEYBOARDS_EDIT_DEFINITION_CLEAR = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/Clear`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateJsonFilename`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateJsonString`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateKeyboardDefinition`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateProductName`;
export const KEYBOARDS_EDIT_DEFINITION_INIT = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/Init`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_AGREEMENT = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateAgreement`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/FirmwareCodePlace`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_URL = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/ForkedRepositoryUrl`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/ForkedRepositoryEvidence`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/OtherPlaceHowToGet`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/OtherPlaceSourceCodeEvidence`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/OtherPlacePublisherEvidence`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/QmkRepositoryFirstPullRequestUrl`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURES = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateFeatures`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateFeature`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_UPLOADED_RATE = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateUploadedRate`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_UPLOADING = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateUploading`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_DESCRIPTION = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateDescription`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_STORES = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateStores`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_WEBSITE_URL = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateWebsiteUrl`;
export const KeyboardsEditDefinitionActions = {
  clear: () => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_CLEAR,
    };
  },
  init: (keyboardDefinitionDocument: IKeyboardDefinitionDocument) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_INIT,
      value: keyboardDefinitionDocument,
    };
  },
  updateJsonFilename: (jsonFilename: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME,
      value: jsonFilename,
    };
  },
  updateJsonString: (jsonStr: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING,
      value: jsonStr,
    };
  },
  updateKeyboardDefinition: (keyboardDefinition: KeyboardDefinitionSchema) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateProductName: (productName: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME,
      value: productName,
    };
  },
  updateAgreement: (agreement: boolean) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_AGREEMENT,
      value: agreement,
    };
  },
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE,
      value: firmwareCodePlace,
    };
  },
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_URL,
      value: forkedRepositoryUrl,
    };
  },
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE,
      value: forkedRepositoryEvidence,
    };
  },
  updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET,
      value: otherPlaceHowToGet,
    };
  },
  updateOtherPlaceSourceCodeEvidence: (
    otherPlaceSourceCodeEvidence: string
  ) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE,
      value: otherPlaceSourceCodeEvidence,
    };
  },
  updateOtherPlacePublisherEvidence: (otherPlacePublisherEvidence: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE,
      value: otherPlacePublisherEvidence,
    };
  },
  updateQmkRepositoryFirstPullRequestUrl: (
    qmkRepositoryFirstPullRequestUrl: string
  ) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL,
      value: qmkRepositoryFirstPullRequestUrl,
    };
  },
  updateFeatures: (features: IKeyboardFeatures[]) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURES,
      value: features,
    };
  },
  updateFeature: (
    value: IKeyboardFeatures | IConditionNotSelected,
    targetFeatures: readonly IKeyboardFeatures[]
  ) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURE,
      value: {
        value,
        targetFeatures,
      },
    };
  },
  updateUploadedRate: (uploadedRate: number) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_UPLOADED_RATE,
      value: uploadedRate,
    };
  },
  updateUploading: (uploading: boolean) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_UPLOADING,
      value: uploading,
    };
  },
  updateDescription: (description: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_DESCRIPTION,
      value: description,
    };
  },
  updateStores: (stores: IStore[]) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_STORES,
      value: stores,
    };
  },
  updateWebsiteUrl: (websiteUrl: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_WEBSITE_URL,
      value: websiteUrl,
    };
  },
};

type ActionTypes = ReturnType<
  typeof KeyboardsAppActions[keyof typeof KeyboardsAppActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const keyboardsActionsThunk = {
  // eslint-disable-next-line no-undef
  logout: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { auth } = getState();
    dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.signout));
    await auth.instance!.signOut();
  },
};
