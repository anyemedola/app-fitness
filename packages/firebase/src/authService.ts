import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth } from "./config";
import type { AuthUser } from "./types";

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoUrl: user.photoURL,
  };
}

/**
 * Signs in with Google via the native account picker, then exchanges the Google ID token
 * for a Firebase credential. Requires `GoogleSignin.configure({ webClientId: ... })` to
 * have been called once at app startup with the OAuth client ID from the Firebase console.
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error("Google sign-in did not return an ID token.");
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(getFirebaseAuth(), credential);
  return toAuthUser(result.user) as AuthUser;
}

/**
 * Signs in with "Sign in with Apple" (iOS only) using a hashed nonce to prevent replay,
 * then exchanges the resulting identity token for a Firebase credential.
 */
export async function signInWithApple(): Promise<AuthUser> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!appleCredential.identityToken) {
    throw new Error("Apple sign-in did not return an identity token.");
  }

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({
    idToken: appleCredential.identityToken,
    rawNonce,
  });
  const result = await signInWithCredential(getFirebaseAuth(), credential);
  return toAuthUser(result.user) as AuthUser;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
  if (GoogleSignin.hasPreviousSignIn()) {
    await GoogleSignin.signOut();
  }
}

export function getCurrentUser(): AuthUser | null {
  return toAuthUser(getFirebaseAuth().currentUser);
}

/** Subscribes to auth state changes; returns an unsubscribe function. */
export function onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
  return firebaseOnAuthStateChanged(getFirebaseAuth(), (user) => callback(toAuthUser(user)));
}
