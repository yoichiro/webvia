import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';
import {
  ICreateKeyboardDefinitionDocumentResult,
  IFetchKeyboardDefinitionDocumentResult,
  IFetchMyKeyboardDefinitionDocumentsResult,
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  IResult,
  IStorage,
  SavedKeymapData,
  ISavedKeymapResult,
  AbstractKeymapData,
  AppliedKeymapData,
  IAppliedKeymapsResult,
  isAppliedKeymapDataInstance,
  IStore,
  IFetchSharedKeymapResult,
} from '../storage/Storage';
import { IAuth, IAuthenticationResult } from '../auth/Auth';
import { IFirmwareCodePlace, IKeyboardFeatures } from '../../store/state';
import { IDeviceInformation } from '../hid/Hid';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export class FirebaseProvider implements IStorage, IAuth {
  private db: firebase.firestore.Firestore;
  private auth: firebase.auth.Auth;
  private storage: firebase.storage.Storage;
  private unsubscribeAuthStateChanged?: firebase.Unsubscribe;

  constructor() {
    firebase.initializeApp(config);
    firebase.analytics();
    const app = firebase.app();
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
  }

  private createResult(
    documentSnapshot: firebase.firestore.QueryDocumentSnapshot
  ): IFetchKeyboardDefinitionDocumentResult {
    return {
      success: true,
      exists: true,
      document: this.generateKeyboardDefinitionDocument(documentSnapshot),
    };
  }

  private generateKeyboardDefinitionDocument(
    documentSnapshot: firebase.firestore.DocumentSnapshot
  ): IKeyboardDefinitionDocument {
    return {
      id: documentSnapshot.id,
      name: documentSnapshot.data()!.name,
      vendorId: documentSnapshot.data()!.vendor_id,
      productId: documentSnapshot.data()!.product_id,
      productName: documentSnapshot.data()!.product_name,
      authorUid: documentSnapshot.data()!.author_uid,
      status: documentSnapshot.data()!.status,
      json: documentSnapshot.data()!.json,
      rejectReason: documentSnapshot.data()!.reject_reason,
      githubDisplayName: documentSnapshot.data()!.github_display_name,
      githubUrl: documentSnapshot.data()!.github_url,
      firmwareCodePlace: documentSnapshot.data()!.firmware_code_place,
      qmkRepositoryFirstPullRequestUrl: documentSnapshot.data()!
        .qmk_repository_first_pull_request_url,
      forkedRepositoryUrl: documentSnapshot.data()!.forked_repository_url,
      forkedRepositoryEvidence: documentSnapshot.data()!
        .forked_repository_evidence,
      otherPlaceHowToGet: documentSnapshot.data()!.other_place_how_to_get,
      otherPlaceSourceCodeEvidence: documentSnapshot.data()!
        .other_place_source_code_evidence,
      otherPlacePublisherEvidence: documentSnapshot.data()!
        .other_place_publisher_evidence,
      features: documentSnapshot.data()!.features || [],
      thumbnailImageUrl: documentSnapshot.data()!.thumbnail_image_url,
      imageUrl: documentSnapshot.data()!.image_url,
      description: documentSnapshot.data()!.description || '',
      stores: documentSnapshot.data()!.stores || [],
      websiteUrl: documentSnapshot.data()!.website_url || '',
      createdAt: documentSnapshot.data()!.created_at.toDate(),
      updatedAt: documentSnapshot.data()!.updated_at.toDate(),
    };
  }

  async fetchMyKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const queryDocumentSnapshot = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .where('author_uid', '==', this.auth.currentUser!.uid)
        .get();
      const result = queryDocumentSnapshot.docs.find(
        (value) => value.id === definitionId
      );
      if (result) {
        return {
          success: true,
          exists: true,
          document: this.generateKeyboardDefinitionDocument(result),
        };
      } else {
        return {
          success: true,
          exists: false,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching the keyboard definition document failed',
        cause: error,
      };
    }
  }

  async fetchMyKeyboardDefinitionDocuments(): Promise<IFetchMyKeyboardDefinitionDocumentsResult> {
    try {
      const querySnapshot = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .where('author_uid', '==', this.auth.currentUser!.uid)
        .orderBy('updated_at', 'desc')
        .get();
      return {
        success: true,
        documents: querySnapshot.docs.map((queryDocumentSnapshot) =>
          this.generateKeyboardDefinitionDocument(queryDocumentSnapshot)
        ),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching the keyboard definition document failed',
        cause: error,
      };
    }
  }

  async fetchKeyboardDefinitionDocumentByDeviceInfo(
    vendorId: number,
    productId: number,
    productName: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const querySnapshotByVidAndPid = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .where('vendor_id', '==', vendorId)
        .where('product_id', '==', productId)
        .where('status', '==', 'approved')
        .get();
      let docs = querySnapshotByVidAndPid.docs;
      if (docs.length > 1) {
        docs = docs.filter((doc) =>
          productName.endsWith(doc.data().product_name)
        );
      }
      if (docs.length === 0) {
        console.warn(
          `Keyboard definition not found: ${vendorId}:${productId}:${productName}`
        );
        return {
          success: true,
          exists: false,
        };
      } else if (docs.length > 1) {
        return {
          success: false,
          error: `There are duplicate keyboard definition documents: ${vendorId}:${productId}:${productName}`,
        };
      } else {
        return this.createResult(docs[0]);
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching the keyboard definition document failed',
        cause: error,
      };
    }
  }

  async updateKeyboardDefinitionJson(
    definitionId: string,
    jsonStr: string
  ): Promise<IResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          json: jsonStr,
          updated_at: now,
        });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Updating the Keyboard Definition JSON content failed.',
        cause: error,
      };
    }
  }

  async updateKeyboardDefinitionDocument(
    definitionId: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    status: IKeyboardDefinitionStatus
  ): Promise<IResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          updated_at: now,
          json: jsonStr,
          name,
          product_id: productId,
          vendor_id: vendorId,
          product_name: productName,
          firmware_code_place: firmwareCodePlace,
          qmk_repository_first_pull_request_url: qmkRepositoryFirstPullRequestUrl,
          forked_repository_url: forkedRepositoryUrl,
          forked_repository_evidence: forkedRepositoryEvidence,
          other_place_how_to_get: otherPlaceHowToGet,
          other_place_source_code_evidence: otherPlaceSourceCodeEvidence,
          other_place_publisher_evidence: otherPlacePublisherEvidence,
          status,
        });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Updating the Keyboard Definition failed.',
        cause: error,
      };
    }
  }

  async updateKeyboardDefinitionDocumentForCatalog(
    definitionId: string,
    features: IKeyboardFeatures[],
    description: string,
    stores: IStore[],
    websiteUrl: string
  ): Promise<IResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          updated_at: now,
          features,
          description,
          stores,
          website_url: websiteUrl,
        });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Updating the Keyboard Definition for Catalog failed.',
        cause: error,
      };
    }
  }

  async createKeyboardDefinitionDocument(
    authorUid: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    githubUid: string,
    githubDisplayName: string,
    githubEmail: string,
    githubUrl: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    status: IKeyboardDefinitionStatus
  ): Promise<ICreateKeyboardDefinitionDocumentResult> {
    try {
      const now = new Date();
      const definitionDocumentReference = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .add({
          author_uid: authorUid,
          created_at: now,
          updated_at: now,
          json: jsonStr,
          name,
          product_id: productId,
          vendor_id: vendorId,
          product_name: productName,
          status,
          github_display_name: githubDisplayName,
          github_url: githubUrl,
          firmware_code_place: firmwareCodePlace,
          qmk_repository_first_pull_request_url: qmkRepositoryFirstPullRequestUrl,
          forked_repository_url: forkedRepositoryUrl,
          forked_repository_evidence: forkedRepositoryEvidence,
          other_place_how_to_get: otherPlaceHowToGet,
          other_place_source_code_evidence: otherPlaceSourceCodeEvidence,
          other_place_publisher_evidence: otherPlacePublisherEvidence,
        });
      await definitionDocumentReference.collection('secure').doc('github').set({
        github_display_name: githubDisplayName,
        github_email: githubEmail,
        github_uid: githubUid,
      });
      return {
        success: true,
        definitionId: definitionDocumentReference.id,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Creating a new Keyboard Definition failed.',
        cause: error,
      };
    }
  }

  async deleteKeyboardDefinitionDocument(
    definitionId: string
  ): Promise<IResult> {
    try {
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .collection('secure')
        .doc('github')
        .delete();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .delete();
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Deleting the keyboard definition failed.',
        cause: error,
      };
    }
  }

  signInWithGitHub(): Promise<void> {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.auth.signInWithRedirect(provider);
  }

  linkToGitHub(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();
      return currentUser.linkWithRedirect(provider);
    } else {
      throw new Error('Invalid situation. Not signed in.');
    }
  }

  async signInWithGitHubWithPopup(): Promise<IAuthenticationResult> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      if (userCredential) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Authenticating with GitHub Account failed.',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
        cause: err,
      };
    }
  }

  async signInWithGoogleWithPopup(): Promise<IAuthenticationResult> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      if (userCredential) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Authenticating with Google Account failed.',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
        cause: err,
      };
    }
  }

  async linkToGoogleWithPopup(): Promise<IAuthenticationResult> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await currentUser.linkWithPopup(provider);
        if (userCredential) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Linking to Google Account failed.',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err.message,
          cause: err,
        };
      }
    } else {
      return {
        success: false,
        error: 'Not authenticated yet.',
      };
    }
  }

  async linkToGitHubWithPopup(): Promise<IAuthenticationResult> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        const provider = new firebase.auth.GithubAuthProvider();
        const userCredential = await currentUser.linkWithPopup(provider);
        if (userCredential) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Linking to GitHub Account failed.',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err.message,
          cause: err,
        };
      }
    } else {
      return {
        success: false,
        error: 'Not authenticated yet.',
      };
    }
  }

  // eslint-disable-next-line no-unused-vars
  subscribeAuthStatus(callback: (user: firebase.User | null) => void): void {
    this.unsubscribeAuthStateChanged && this.unsubscribeAuthStateChanged();
    this.unsubscribeAuthStateChanged = this.auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        callback(user);
      }
    );
  }

  getCurrentAuthenticatedUser(): firebase.User {
    return this.auth.currentUser!;
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  /**
   * Fetch my owned keymaps, regardless of status.
   */
  async fetchMySavedKeymaps(
    info: IDeviceInformation
  ): Promise<ISavedKeymapResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('saved-keymaps')
      .where('author_uid', '==', this.auth.currentUser!.uid)
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('created_at', 'asc')
      .get();
    const keymaps: SavedKeymapData[] = this.filterKeymapsByProductName(
      snapshot,
      info
    );
    return {
      success: true,
      savedKeymaps: keymaps,
    };
  }

  async fetchSharedKeymaps(
    info: IDeviceInformation,
    withoutMine: boolean
  ): Promise<ISavedKeymapResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('saved-keymaps')
      .where('status', '==', 'shared')
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('created_at', 'desc')
      .get();
    let keymaps: SavedKeymapData[] = this.filterKeymapsByProductName<SavedKeymapData>(
      snapshot,
      info
    );
    if (withoutMine) {
      keymaps = keymaps.filter(
        (keymap) => keymap.author_uid !== this.auth.currentUser!.uid
      );
    }
    return {
      success: true,
      savedKeymaps: keymaps,
    };
  }

  filterKeymapsByProductName<T extends AbstractKeymapData>(
    snapshot: firebase.firestore.QuerySnapshot,
    info: IDeviceInformation
  ): T[] {
    const deviceProductName = info.productName;
    const keymaps: T[] = [];
    snapshot.docs.forEach((doc) => {
      const data: T = {
        id: doc.id,
        ...(doc.data() as T),
      };
      const savedProductName = data.product_name;

      /**
       * The device's ProductName might be different by using OS.
       * This is the WebHID bug.
       * https://bugs.chromium.org/p/chromium/issues/detail?id=1167093
       *
       * The ProductName is defined text by #PRODUCT in config.h/info.h.
       * However with Linux, the ProductName is a combination of defined text with #MANUFACTURER and #PRODUCT.
       *
       * ex)
       * Lunakey Mini (macOS, Windows)
       * yoichiro Lunakey Mini (Linux)
       *
       * This is why we need to filter the data by ProductName here.
       */
      if (
        deviceProductName.endsWith(savedProductName) ||
        savedProductName.endsWith(deviceProductName)
      ) {
        keymaps.push(data);
      }
    });
    return keymaps;
  }

  async createSavedKeymap(keymapData: SavedKeymapData): Promise<IResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .add({
          ...keymapData,
          created_at: now,
          updated_at: now,
        });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Creating a new Keymap failed.',
        cause: error,
      };
    }
  }

  async updateSavedKeymap(keymapData: SavedKeymapData): Promise<IResult> {
    try {
      const now = new Date();
      const keymapDataId = keymapData.id!;
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapDataId)
        .update({
          title: keymapData.title,
          desc: keymapData.desc,
          status: keymapData.status,
          author_display_name: keymapData.author_display_name,
          updated_at: now,
        });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Updating a new Keymap failed.',
        cause: error,
      };
    }
  }

  async deleteSavedKeymap(keymapId: string): Promise<IResult> {
    try {
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapId)
        .delete();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Deleting a new Keymap failed.',
        cause: error,
      };
    }
  }

  async createOrUpdateAppliedKeymap(
    keymapData: AbstractKeymapData
  ): Promise<IResult> {
    try {
      const savedKeymapId = isAppliedKeymapDataInstance(keymapData)
        ? (keymapData as AppliedKeymapData).saved_keymap_id
        : keymapData.id;
      const appliedKeymapsSnapshot = await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('applied-keymaps')
        .where('applied_uid', '==', this.auth.currentUser!.uid)
        .where('saved_keymap_id', '==', savedKeymapId)
        .get();
      if (appliedKeymapsSnapshot.empty) {
        // Create
        const now = new Date();
        const appliedKeymapData: AppliedKeymapData = {
          applied_uid: this.auth.currentUser!.uid,
          saved_keymap_id: savedKeymapId!,
          author_uid: keymapData.author_uid,
          author_display_name: keymapData.author_display_name,
          vendor_id: keymapData.vendor_id,
          product_id: keymapData.product_id,
          product_name: keymapData.product_name,
          title: keymapData.title,
          desc: keymapData.desc,
          label_lang: keymapData.label_lang,
          layout_options: keymapData.layout_options,
          keycodes: keymapData.keycodes,
          created_at: now,
          updated_at: now,
        };
        await this.db
          .collection('keymaps')
          .doc('v1')
          .collection('applied-keymaps')
          .add(appliedKeymapData);
        return {
          success: true,
        };
      } else if (appliedKeymapsSnapshot.size === 1) {
        // Update
        const appliedKeymapDoc = appliedKeymapsSnapshot.docs[0];
        await this.db
          .collection('keymaps')
          .doc('v1')
          .collection('applied-keymaps')
          .doc(appliedKeymapDoc.id)
          .update({
            author_display_name: keymapData.author_display_name,
            title: keymapData.title,
            desc: keymapData.desc,
            label_lang: keymapData.label_lang,
            layout_options: keymapData.layout_options,
            keycodes: keymapData.keycodes,
            updated_at: new Date(),
          });
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: `Duplicated applied-keymap data found. The count is ${appliedKeymapsSnapshot.size}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Creating or updating an applied Keymap failed.',
        cause: error,
      };
    }
  }

  async fetchMyAppliedKeymaps(
    info: IDeviceInformation
  ): Promise<IAppliedKeymapsResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('applied-keymaps')
      .where('applied_uid', '==', this.auth.currentUser!.uid)
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('updated_at', 'desc')
      .get();
    const keymaps: AppliedKeymapData[] = this.filterKeymapsByProductName(
      snapshot,
      info
    );
    return {
      success: true,
      appliedKeymaps: keymaps,
    };
  }

  async fetchSharedKeymap(keymapId: string): Promise<IFetchSharedKeymapResult> {
    try {
      const keymapSnapshot = await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapId)
        .get();
      if (keymapSnapshot.exists) {
        const data: SavedKeymapData = {
          id: keymapSnapshot.id,
          ...(keymapSnapshot.data() as SavedKeymapData),
        };
        return {
          success: true,
          sharedKeymap: data,
        };
      } else {
        return {
          success: false,
          error: `Shared keymap data [${keymapId}] not found.`,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: `Fetching shared keymap [${keymapId}] failed.`,
        cause: error,
      };
    }
  }

  async searchKeyboardsByFeatures(
    features: IKeyboardFeatures[]
  ): Promise<IFetchMyKeyboardDefinitionDocumentsResult> {
    try {
      let querySnapshot;
      if (features.length === 0) {
        querySnapshot = await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('status', '==', 'approved')
          .get();
      } else {
        querySnapshot = await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('features', 'array-contains-any', features)
          .where('status', '==', 'approved')
          .get();
      }
      return {
        success: true,
        documents: querySnapshot.docs.map((queryDocumentSnapshot) =>
          this.generateKeyboardDefinitionDocument(queryDocumentSnapshot)
        ),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error:
          'Searching the keyboard definition document with features failed',
        cause: error,
      };
    }
  }

  async fetchKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const documentSnapshot = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .get();
      if (documentSnapshot.exists) {
        return {
          success: true,
          exists: true,
          document: this.generateKeyboardDefinitionDocument(documentSnapshot),
        };
      } else {
        return {
          success: false,
          exists: false,
          error: `The keyboard definition [${definitionId}] not found`,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching the keyboard definition document failed',
        cause: error,
      };
    }
  }

  async uploadKeyboardCatalogImage(
    definitionId: string,
    file: File,
    // eslint-disable-next-line no-unused-vars
    progress: (uploadedRate: number) => void
  ): Promise<IResult> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IResult>((resolve, reject) => {
      const uploadTask = this.storage.ref(`/catalog/${definitionId}`).put(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const rate = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress(rate);
        },
        (error) => {
          console.error(error);
          resolve({
            success: false,
            error: 'Uploading keyboard catalog image failed.',
            cause: error,
          });
        },
        async () => {
          const thumbnailImageUrl = await this.storage
            .ref(`/catalog/resized/${definitionId}_200x150`)
            .getDownloadURL();
          const imageUrl = await this.storage
            .ref(`/catalog/resized/${definitionId}_400x300`)
            .getDownloadURL();
          await this.db
            .collection('keyboards')
            .doc('v2')
            .collection('definitions')
            .doc(definitionId)
            .update({
              thumbnail_image_url: thumbnailImageUrl,
              image_url: imageUrl,
              updated_at: new Date(),
            });
          resolve({
            success: true,
          });
        }
      );
    });
  }
}
