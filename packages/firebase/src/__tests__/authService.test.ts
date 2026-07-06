jest.mock("../config", () => ({
  getFirebaseAuth: jest.fn(),
}));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    hasPreviousSignIn: jest.fn(),
    signOut: jest.fn(),
  },
}));

jest.mock("expo-apple-authentication", () => ({
  signInAsync: jest.fn(),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));

jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "raw-nonce"),
  digestStringAsync: jest.fn(async () => "hashed-nonce"),
  CryptoDigestAlgorithm: { SHA256: "SHA-256" },
}));

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn(() => "google-credential") },
  OAuthProvider: jest.fn().mockImplementation(() => ({
    credential: jest.fn(() => "apple-credential"),
  })),
  onAuthStateChanged: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
}));

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { onAuthStateChanged, signInWithCredential, signOut as firebaseSignOut } from "firebase/auth";

import { getCurrentUser, onAuthStateChanged as onAuthStateChangedService, signInWithApple, signInWithGoogle, signOut } from "../authService";
import { getFirebaseAuth } from "../config";

const fakeAuth = { currentUser: null } as any;
(getFirebaseAuth as jest.Mock).mockReturnValue(fakeAuth);

const fakeFirebaseUser = {
  uid: "u1",
  email: "lia@example.com",
  displayName: "Lia",
  photoURL: null,
};

describe("signInWithGoogle", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exchanges the Google ID token for a Firebase credential", async () => {
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: { idToken: "id-token" } });
    (signInWithCredential as jest.Mock).mockResolvedValue({ user: fakeFirebaseUser });

    const user = await signInWithGoogle();

    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(signInWithCredential).toHaveBeenCalledWith(fakeAuth, "google-credential");
    expect(user).toEqual({ uid: "u1", email: "lia@example.com", displayName: "Lia", photoUrl: null });
  });

  it("throws when Google does not return an ID token", async () => {
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({ data: {} });
    await expect(signInWithGoogle()).rejects.toThrow(/did not return an ID token/);
  });
});

describe("signInWithApple", () => {
  beforeEach(() => jest.clearAllMocks());

  it("hashes a nonce and exchanges the Apple identity token", async () => {
    (AppleAuthentication.signInAsync as jest.Mock).mockResolvedValue({ identityToken: "apple-id-token" });
    (signInWithCredential as jest.Mock).mockResolvedValue({ user: fakeFirebaseUser });

    const user = await signInWithApple();

    expect(AppleAuthentication.signInAsync).toHaveBeenCalledWith(
      expect.objectContaining({ nonce: "hashed-nonce" }),
    );
    expect(signInWithCredential).toHaveBeenCalledWith(fakeAuth, "apple-credential");
    expect(user.uid).toBe("u1");
  });

  it("throws when Apple does not return an identity token", async () => {
    (AppleAuthentication.signInAsync as jest.Mock).mockResolvedValue({ identityToken: null });
    await expect(signInWithApple()).rejects.toThrow(/did not return an identity token/);
  });
});

describe("signOut", () => {
  beforeEach(() => jest.clearAllMocks());

  it("signs out of Firebase and Google when a Google session is active", async () => {
    (GoogleSignin.hasPreviousSignIn as jest.Mock).mockReturnValue(true);
    await signOut();
    expect(firebaseSignOut).toHaveBeenCalledWith(fakeAuth);
    expect(GoogleSignin.signOut).toHaveBeenCalled();
  });

  it("skips Google sign-out when there is no Google session", async () => {
    (GoogleSignin.hasPreviousSignIn as jest.Mock).mockReturnValue(false);
    await signOut();
    expect(GoogleSignin.signOut).not.toHaveBeenCalled();
  });
});

describe("getCurrentUser", () => {
  it("maps the current Firebase user", () => {
    fakeAuth.currentUser = fakeFirebaseUser;
    expect(getCurrentUser()).toEqual({ uid: "u1", email: "lia@example.com", displayName: "Lia", photoUrl: null });
  });

  it("returns null when signed out", () => {
    fakeAuth.currentUser = null;
    expect(getCurrentUser()).toBeNull();
  });
});

describe("onAuthStateChanged (service)", () => {
  it("maps the Firebase user before calling back", () => {
    const callback = jest.fn();
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(fakeFirebaseUser);
      return () => {};
    });

    onAuthStateChangedService(callback);

    expect(callback).toHaveBeenCalledWith({ uid: "u1", email: "lia@example.com", displayName: "Lia", photoUrl: null });
  });
});
