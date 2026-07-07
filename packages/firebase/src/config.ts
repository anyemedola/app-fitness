import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// `@firebase/auth`'s own package.json *does* declare a "react-native" export condition
// (unlike the `firebase/auth` wrapper, which has none), and Metro's bundler resolves it
// correctly at runtime on ios/android. `tsc`'s plain Node resolution instead always matches
// the package's top-level "types" entry, whose public .d.ts doesn't declare
// `getReactNativePersistence` — so we reach it via a namespace import cast locally instead of
// fighting module resolution settings (which, when overridden project-wide, broke unrelated
// imports across this package). On web, Metro resolves the plain browser build instead, which
// has no such export, so that platform must use the browser persistence APIs below.
import * as FirebaseAuthReactNative from "@firebase/auth";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
  type Persistence,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const getReactNativePersistence = (
  FirebaseAuthReactNative as unknown as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
  }
).getReactNativePersistence;

function getPlatformPersistence(): Persistence {
  return Platform.OS === "web"
    ? indexedDBLocalPersistence
    : getReactNativePersistence(AsyncStorage);
}

export interface FirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let services: FirebaseServices | null = null;

/**
 * Initializes (or reuses, on fast-refresh) the Firebase app and its Auth/Firestore/Storage
 * handles. Call once at app startup — see `apps/mobile`'s `src/infra/firebase.ts` — with
 * config read from `EXPO_PUBLIC_FIREBASE_*` env vars (see `.env.example`).
 */
export function initFirebase(config: FirebaseEnvConfig): FirebaseServices {
  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = initializeAuth(app, {
    persistence: getPlatformPersistence(),
  });
  const db = getFirestore(app);
  const storage = getStorage(app);
  services = { app, auth, db, storage };
  return services;
}

function requireServices(): FirebaseServices {
  if (!services) {
    throw new Error("Firebase has not been initialized yet. Call initFirebase() at app startup.");
  }
  return services;
}

export function getFirebaseApp(): FirebaseApp {
  return requireServices().app;
}

export function getFirebaseAuth(): Auth {
  return requireServices().auth;
}

export function getFirestoreDb(): Firestore {
  return requireServices().db;
}

export function getFirebaseStorage(): FirebaseStorage {
  return requireServices().storage;
}

/** Test-only escape hatch so service modules can be unit tested without a real app init. */
export function __setFirebaseServicesForTesting(next: FirebaseServices | null): void {
  services = next;
}
