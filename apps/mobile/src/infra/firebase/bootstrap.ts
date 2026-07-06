import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initFirebase } from "@app-fitness/firebase";

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

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  });
}
