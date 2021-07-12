import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  ICatalogPhase,
  IKeyboardsPhase,
  KeyboardsPhase,
  RootState,
  SetupPhase,
} from '../store/state';
import {
  AppActions,
  KeymapActions,
  KeycodeKeyActions,
  KeydiffActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { HidActions, hidActionsThunk } from './hid.action';
import { validateKeyboardDefinitionSchema } from '../services/storage/Validator';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import {
  AbstractKeymapData,
  AppliedKeymapData,
  IKeyboardDefinitionDocument,
  KeyboardDefinitionStatus,
  SavedKeymapData,
} from '../services/storage/Storage';
import {
  KeyboardsAppActions,
  KeyboardsEditDefinitionActions,
} from './keyboards.actions';
import { getGitHubProviderData } from '../services/auth/Auth';
import { IDeviceInformation } from '../services/hid/Hid';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import { CatalogAppActions } from './catalog.action';
import * as qs from 'qs';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocument`;
export const STORAGE_UPDATE_SAVED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSavedKeymaps`;
export const STORAGE_UPDATE_SHARED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSharedKeymaps`;
export const STORAGE_UPDATE_APPLIED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateAppliedKeymaps`;
export const STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateSearchResultKeyboardDefinitionDocument`;
export const StorageActions = {
  updateKeyboardDefinition: (keyboardDefinition: any) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateKeyboardDefinitionDocuments: (
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS,
      value: keyboardDefinitionDocuments,
    };
  },
  updateKeyboardDefinitionDocument: (
    keyboardDefinitionDocument: IKeyboardDefinitionDocument
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: keyboardDefinitionDocument,
    };
  },
  clearKeyboardDefinitionDocument: () => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: null,
    };
  },
  updateSavedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SAVED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSharedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SHARED_KEYMAPS,
      value: keymaps,
    };
  },
  updateAppliedKeymaps: (keymaps: AppliedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_APPLIED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSearchResultKeyboardDefinitionDocument: (
    definitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT,
      value: definitions,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof AppActions[keyof typeof AppActions]
  | typeof KeymapActions[keyof typeof KeymapActions]
  | typeof KeycodeKeyActions[keyof typeof KeycodeKeyActions]
  | typeof KeydiffActions[keyof typeof KeydiffActions]
  | typeof HidActions[keyof typeof HidActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof StorageActions[keyof typeof StorageActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  // eslint-disable-next-line no-undef
  refreshKeyboardDefinition: (
    keyboardDefinition: KeyboardDefinitionSchema
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { entities } = getState();
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(AppActions.remapsInit(entities.device.layerCount));
    dispatch(KeydiffActions.clearKeydiff());
    dispatch(KeycodeKeyActions.clear());
    dispatch(KeymapActions.clearSelectedPos());
  },

  // eslint-disable-next-line no-undef
  uploadKeyboardDefinition: (
    keyboardDefinition: KeyboardDefinitionSchema
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    dispatch(hidActionsThunk.openKeyboard());
  },

  fetchKeyboardDefinitionById: (
    definitionId: string,
    nextPhase: IKeyboardsPhase
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance!.fetchMyKeyboardDefinitionDocumentById(
      definitionId
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchKeyboardDefinitionResult.error!,
          fetchKeyboardDefinitionResult.cause
        )
      );
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      const definitionDocument = fetchKeyboardDefinitionResult.document!;
      dispatch(
        StorageActions.updateKeyboardDefinitionDocument(definitionDocument)
      );
      dispatch(KeyboardsEditDefinitionActions.clear());
      dispatch(KeyboardsEditDefinitionActions.init(definitionDocument));
      dispatch(
        KeyboardsEditDefinitionActions.updateFeatures(
          definitionDocument.features
        )
      );
      dispatch(
        KeyboardsEditDefinitionActions.updateDescription(
          definitionDocument.description
        )
      );
      dispatch(
        KeyboardsEditDefinitionActions.updateStores(
          definitionDocument.stores || []
        )
      );
      dispatch(
        KeyboardsEditDefinitionActions.updateWebsiteUrl(
          definitionDocument.websiteUrl
        )
      );
      dispatch(KeyboardsAppActions.updatePhase(nextPhase));
    } else {
      dispatch(NotificationActions.addWarn('No such keyboard.'));
      dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    }
  },

  fetchKeyboardDefinitionByDeviceInfo: (
    vendorId: number,
    productId: number,
    productName: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, app } = getState();

    if (storage.instance === null) {
      console.warn(
        'To work Remap locally, skip accessing to Firebase and move to the uploading phase.'
      );
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
      return;
    }

    let keyboardDefinitionDocument: IKeyboardDefinitionDocument | undefined;

    const fetchKeyboardDefinitionResult = await storage.instance!.fetchKeyboardDefinitionDocumentByDeviceInfo(
      vendorId,
      productId,
      productName
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchKeyboardDefinitionResult.error!,
          fetchKeyboardDefinitionResult.cause
        )
      );
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      keyboardDefinitionDocument = fetchKeyboardDefinitionResult.document!;
    } else {
      if (!app.signedIn) {
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }
      const myKeyboardDefinitionDocumentsResult = await storage.instance!.fetchMyKeyboardDefinitionDocuments();
      if (!myKeyboardDefinitionDocumentsResult.success) {
        console.error(myKeyboardDefinitionDocumentsResult.cause!);
        dispatch(
          NotificationActions.addError(
            myKeyboardDefinitionDocumentsResult.error!,
            myKeyboardDefinitionDocumentsResult.cause
          )
        );
        return;
      }
      keyboardDefinitionDocument = myKeyboardDefinitionDocumentsResult.documents!.find(
        (doc) =>
          doc.vendorId === vendorId &&
          doc.productId === productId &&
          productName.endsWith(doc.productName)
      );
    }

    if (!keyboardDefinitionDocument) {
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
      return;
    }

    let keyboardDefinition: KeyboardDefinitionSchema;
    const jsonStr: string = keyboardDefinitionDocument.json;
    try {
      keyboardDefinition = JSON.parse(jsonStr);
    } catch (error) {
      dispatch(NotificationActions.addError('JSON parse error'));
      return;
    }
    const validateResult = validateKeyboardDefinitionSchema(keyboardDefinition);
    if (!validateResult.valid) {
      dispatch(NotificationActions.addError(validateResult.errors![0].message));
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
      return;
    }

    dispatch(
      StorageActions.updateKeyboardDefinitionDocument(
        keyboardDefinitionDocument
      )
    );
    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
    await dispatch(hidActionsThunk.openKeyboard());
  },

  fetchMyKeyboardDefinitionDocuments: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchMyKeyboardDefinitionsResult = await storage.instance!.fetchMyKeyboardDefinitionDocuments();
    if (!fetchMyKeyboardDefinitionsResult.success) {
      console.error(fetchMyKeyboardDefinitionsResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchMyKeyboardDefinitionsResult.error!,
          fetchMyKeyboardDefinitionsResult.cause
        )
      );
      return;
    }
    dispatch(
      StorageActions.updateKeyboardDefinitionDocuments(
        fetchMyKeyboardDefinitionsResult.documents!
      )
    );
    dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
  },

  createKeyboardDefinitionAsDraft: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, auth, keyboards, github } = getState();
    const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;
    const user = auth.instance!.getCurrentAuthenticatedUser();
    const githubProviderDataResutl = getGitHubProviderData(user);
    if (!githubProviderDataResutl.exists) {
      console.error('The user does not have a GitHub Provider data.');
      dispatch(
        NotificationActions.addError(
          'The user does not have a GitHub Provider data.'
        )
      );
      return;
    }
    const githubProviderData = githubProviderDataResutl.userInfo!;

    const fetchAccountInfoResult = await github.instance.fetchAccountInfo(
      githubProviderData.uid
    );
    if (!fetchAccountInfoResult.success) {
      console.error(fetchAccountInfoResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchAccountInfoResult.error!,
          fetchAccountInfoResult.cause
        )
      );
      return;
    }
    const githubAccountInfo = fetchAccountInfoResult.info!;

    const jsonStr = keyboards.createdefinition.jsonString;
    const result = await storage.instance!.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      keyboards.createdefinition.productName,
      jsonStr,
      githubProviderData.uid,
      githubProviderData.displayName || '',
      githubProviderData.email || '',
      githubAccountInfo.html_url,
      keyboards.createdefinition.firmwareCodePlace,
      keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl,
      keyboards.createdefinition.forkedRepositoryUrl,
      keyboards.createdefinition.forkedRepositoryEvidence,
      keyboards.createdefinition.otherPlaceHowToGet,
      keyboards.createdefinition.otherPlaceSourceCodeEvidence,
      keyboards.createdefinition.otherPlacePublisherEvidence,
      KeyboardDefinitionStatus.draft
    );
    if (result.success) {
      dispatch(await storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  createAndSubmitKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, auth, keyboards, github } = getState();
    const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;

    const user = auth.instance!.getCurrentAuthenticatedUser();
    const githubProviderDataResutl = getGitHubProviderData(user);
    if (!githubProviderDataResutl.exists) {
      console.error('The user does not have a GitHub Provider data.');
      dispatch(
        NotificationActions.addError(
          'The user does not have a GitHub Provider data.'
        )
      );
      return;
    }
    const githubProviderData = githubProviderDataResutl.userInfo!;

    const fetchAccountInfoResult = await github.instance.fetchAccountInfo(
      githubProviderData.uid
    );
    if (!fetchAccountInfoResult.success) {
      console.error(fetchAccountInfoResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchAccountInfoResult.error!,
          fetchAccountInfoResult.cause
        )
      );
      return;
    }
    const githubAccountInfo = fetchAccountInfoResult.info!;

    const jsonStr = keyboards.createdefinition.jsonString;
    const result = await storage.instance!.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      keyboards.createdefinition.productName,
      jsonStr,
      githubProviderData.uid,
      githubProviderData.displayName || '',
      githubProviderData.email || '',
      githubAccountInfo.html_url,
      keyboards.createdefinition.firmwareCodePlace,
      keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl,
      keyboards.createdefinition.forkedRepositoryUrl,
      keyboards.createdefinition.forkedRepositoryEvidence,
      keyboards.createdefinition.otherPlaceHowToGet,
      keyboards.createdefinition.otherPlaceSourceCodeEvidence,
      keyboards.createdefinition.otherPlacePublisherEvidence,
      KeyboardDefinitionStatus.in_review
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          result.definitionId!,
          'edit'
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateKeyboardDefinitionAsDraft: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionDocument(
      definitionDoc!.id,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      keyboards.editdefinition.productName,
      jsonStr,
      keyboards.editdefinition.firmwareCodePlace!,
      keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl,
      keyboards.editdefinition.forkedRepositoryUrl,
      keyboards.editdefinition.forkedRepositoryEvidence,
      keyboards.editdefinition.otherPlaceHowToGet,
      keyboards.editdefinition.otherPlaceSourceCodeEvidence,
      keyboards.editdefinition.otherPlacePublisherEvidence,
      KeyboardDefinitionStatus.draft
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          definitionDoc!.id,
          'edit'
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateAndSubmitKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;

    const definitionDoc = entities.keyboardDefinitionDocument;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionDocument(
      definitionDoc!.id,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      keyboards.editdefinition.productName,
      jsonStr,
      keyboards.editdefinition.firmwareCodePlace!,
      keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl,
      keyboards.editdefinition.forkedRepositoryUrl,
      keyboards.editdefinition.forkedRepositoryEvidence,
      keyboards.editdefinition.otherPlaceHowToGet,
      keyboards.editdefinition.otherPlaceSourceCodeEvidence,
      keyboards.editdefinition.otherPlacePublisherEvidence,
      KeyboardDefinitionStatus.in_review
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          definitionDoc!.id,
          'edit'
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateKeyboardDefinitionJsonFile: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionJson(
      definitionDoc!.id,
      jsonStr
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          definitionDoc!.id,
          'edit'
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  deleteKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const result = await storage.instance!.deleteKeyboardDefinitionDocument(
      definitionDoc!.id
    );
    if (result.success) {
      dispatch(await storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  fetchMySavedKeymaps: (
    info: IDeviceInformation
  ): ThunkPromiseAction<void> => async (
    // eslint-disable-next-line no-unused-vars
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const resultList = await storage.instance!.fetchMySavedKeymaps(info);

    if (resultList.success) {
      dispatch(StorageActions.updateSavedKeymaps(resultList.savedKeymaps));
    } else {
      console.error(resultList.cause!);
      dispatch(
        NotificationActions.addError(resultList.error!, resultList.cause)
      );
    }
  },

  fetchSharedKeymaps: (
    info: IDeviceInformation,
    withoutMine: boolean
  ): ThunkPromiseAction<void> => async (
    // eslint-disable-next-line no-unused-vars
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const resultList = await storage.instance!.fetchSharedKeymaps(
      info,
      withoutMine
    );

    if (resultList.success) {
      dispatch(StorageActions.updateSharedKeymaps(resultList.savedKeymaps));
    } else {
      console.error(resultList.cause!);
      dispatch(
        NotificationActions.addError(resultList.error!, resultList.cause)
      );
    }
  },

  createSavedKeymap: (
    keymapData: SavedKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();

    sendEventToGoogleAnalytics('configure/save_keymap', {
      vendor_id: keymapData.vendor_id,
      product_id: keymapData.product_id,
      product_name: keymapData.product_name,
    });

    const result = await storage.instance!.createSavedKeymap(keymapData);
    if (!result.success) {
      console.error(result.cause!);
      dispatch(
        NotificationActions.addError(
          `Couldn't save the keymap: ${result.error!}`,
          result.cause
        )
      );
      return;
    }
    const info: IDeviceInformation = {
      vendorId: keymapData.vendor_id,
      productId: keymapData.product_id,
      productName: keymapData.product_name,
    };
    dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
  },

  updateSavedKeymap: (
    keymapData: SavedKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const result = await storage.instance!.updateSavedKeymap(keymapData);
    if (!result.success) {
      console.error(result.cause!);
      dispatch(
        NotificationActions.addError(
          `Couldn't update the keymap: ${result.error!}`,
          result.cause
        )
      );
      return;
    }

    const info: IDeviceInformation = {
      vendorId: keymapData.vendor_id,
      productId: keymapData.product_id,
      productName: keymapData.product_name,
    };
    dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
  },

  deleteSavedKeymap: (
    keymapData: SavedKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const result = await storage.instance!.deleteSavedKeymap(keymapData.id!);
    if (!result.success) {
      console.error(result.cause!);
      dispatch(
        NotificationActions.addError(
          `Couldn't delete the keymap: ${result.error!}`,
          result.cause
        )
      );
      return;
    }

    const info: IDeviceInformation = {
      vendorId: keymapData.vendor_id,
      productId: keymapData.product_id,
      productName: keymapData.product_name,
    };
    dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
  },

  createOrUpdateAppliedKeymap: (
    keymapData: AbstractKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const result = await storage.instance!.createOrUpdateAppliedKeymap(
      keymapData
    );
    if (!result.success) {
      console.error(result.cause!);
      dispatch(
        NotificationActions.addError(
          `Creating or updating the applied keymap failed: ${result.error!}`,
          result.cause
        )
      );
      return;
    }
    const info: IDeviceInformation = {
      vendorId: keymapData.vendor_id,
      productId: keymapData.product_id,
      productName: keymapData.product_name,
    };
    dispatch(await storageActionsThunk.fetchMyAppliedKeymaps(info));
  },

  fetchMyAppliedKeymaps: (
    info: IDeviceInformation
  ): ThunkPromiseAction<void> => async (
    // eslint-disable-next-line no-unused-vars
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const resultList = await storage.instance!.fetchMyAppliedKeymaps(info);

    if (resultList.success) {
      dispatch(StorageActions.updateAppliedKeymaps(resultList.appliedKeymaps));
    } else {
      console.error(resultList.cause!);
      dispatch(
        NotificationActions.addError(resultList.error!, resultList.cause)
      );
    }
  },

  searchKeyboardsForCatalog: (): ThunkPromiseAction<void> => async (
    // eslint-disable-next-line no-unused-vars
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    dispatch(CatalogAppActions.updatePhase('processing'));
    const { catalog, storage } = getState();
    const features = catalog.search.features;
    const keyword = catalog.search.keyword;
    let result = await storage.instance!.searchKeyboardsByFeatures(features);
    if (result.success) {
      const definitionDocs = result.documents!.filter((doc) =>
        doc.name.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedFeaturesCount = (
        doc: IKeyboardDefinitionDocument
      ): number => {
        return doc.features.reduce<number>((result, feature) => {
          return features!.includes(feature) ? result + 1 : result;
        }, 0);
      };
      const sortedSearchResult = definitionDocs.slice().sort((a, b) => {
        const countA = matchedFeaturesCount(a);
        const countB = matchedFeaturesCount(b);
        if (countA === countB) {
          return Math.random() - 0.5;
        } else {
          return matchedFeaturesCount(a) - matchedFeaturesCount(b);
        }
      });
      dispatch(
        StorageActions.updateSearchResultKeyboardDefinitionDocument(
          sortedSearchResult
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
    const query: { [p: string]: string | string[] } = {};
    if (keyword) {
      query.keyword = keyword;
    }
    if (features && features.length > 0) {
      query.features = features.join(',');
    }
    history.replaceState(null, 'Remap', `/catalog?${qs.stringify(query)}`);
    dispatch(CatalogAppActions.updatePhase('list'));
  },

  fetchKeyboardDefinitionForCatalogById: (
    definitionId: string,
    nextPhase: ICatalogPhase
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance!.fetchKeyboardDefinitionDocumentById(
      definitionId
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchKeyboardDefinitionResult.error!,
          fetchKeyboardDefinitionResult.cause
        )
      );
      dispatch(CatalogAppActions.updatePhase('init'));
      dispatch(await storageActionsThunk.searchKeyboardsForCatalog());
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      const keyboardDefinitionDocument = fetchKeyboardDefinitionResult.document!;
      dispatch(
        StorageActions.updateKeyboardDefinitionDocument(
          keyboardDefinitionDocument
        )
      );

      let keyboardDefinition: KeyboardDefinitionSchema;
      const jsonStr: string = keyboardDefinitionDocument.json;
      try {
        keyboardDefinition = JSON.parse(jsonStr);
      } catch (error) {
        dispatch(NotificationActions.addError('JSON parse error'));
        return;
      }
      const validateResult = validateKeyboardDefinitionSchema(
        keyboardDefinition
      );
      if (!validateResult.valid) {
        dispatch(
          NotificationActions.addError(validateResult.errors![0].message)
        );
        return;
      }
      dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
      dispatch(
        LayoutOptionsActions.initSelectedOptions(
          keyboardDefinition.layouts.labels
            ? keyboardDefinition.layouts.labels
            : []
        )
      );
      dispatch(
        await storageActionsThunk.fetchSharedKeymaps(
          keyboardDefinitionDocument,
          false
        )
      );

      dispatch(CatalogAppActions.updatePhase(nextPhase));
    } else {
      dispatch(NotificationActions.addWarn('No such keyboard.'));
      dispatch(CatalogAppActions.updatePhase('init'));
    }
  },

  updateKeyboardDefinitionForCatalog: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    dispatch(KeyboardsAppActions.updatePhase('processing'));
    const { storage, keyboards, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const features = keyboards.editdefinition.features;
    const description = keyboards.editdefinition.description;
    const stores = keyboards.editdefinition.stores;
    const websiteUrl = keyboards.editdefinition.websiteUrl;
    const result = await storage.instance!.updateKeyboardDefinitionDocumentForCatalog(
      definitionDoc!.id,
      features,
      description,
      stores,
      websiteUrl
    );
    if (result.success) {
      dispatch(
        NotificationActions.addSuccess(
          'Updating the keyboard definition succeeded.'
        )
      );
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          definitionDoc!.id,
          'catalog'
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  uploadKeyboardCatalogImage: (
    definitionId: string,
    file: File
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    dispatch(KeyboardsEditDefinitionActions.updateUploading(true));
    dispatch(KeyboardsEditDefinitionActions.updateUploadedRate(0));
    const { storage } = getState();
    const result = await storage.instance!.uploadKeyboardCatalogImage(
      definitionId,
      file,
      (uploadedRate) =>
        dispatch(
          KeyboardsEditDefinitionActions.updateUploadedRate(uploadedRate)
        )
    );
    if (result.success) {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      setTimeout(async () => {
        dispatch(KeyboardsEditDefinitionActions.updateUploadedRate(0));
        dispatch(KeyboardsEditDefinitionActions.updateUploading(false));
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionId,
            'catalog'
          )
        );
      }, 3000);
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },
};
