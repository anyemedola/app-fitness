import { initFirebase } from "@app-fitness/firebase";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

let initialized = false;

/** Initializes Firebase + Google Sign-In once at app startup (called from `app/_layout.tsx`). */
export function bootstrapFirebase(): void {
  if (initialized) return;
  initialized = true;

  initFirebase({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
  });

  // @react-native-google-signin only implements `configure` on native; on web it just
  // logs a "not-implemented, sponsors only" warning, so skip it there. Its native module
  // also isn't present in Expo Go (only in a custom dev client / standalone build), so
  // skip there too — otherwise it crashes the whole app at startup.
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (Platform.OS !== "web" && !isExpoGo) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy require, see comment above
    const { GoogleSignin } = require("@react-native-google-signin/google-signin");
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    });
  }
}
