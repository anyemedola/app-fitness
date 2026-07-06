import * as firebase from "@app-fitness/firebase";
import type { AuthUser } from "@app-fitness/firebase";

import type { AuthRepository } from "../../domain/repositories/AuthRepository";

/** Thin adapter over `packages/firebase`'s authService, satisfying the domain's `AuthRepository` port. */
export class FirebaseAuthRepository implements AuthRepository {
  signInWithGoogle(): Promise<AuthUser> {
    return firebase.signInWithGoogle();
  }

  signInWithApple(): Promise<AuthUser> {
    return firebase.signInWithApple();
  }

  signOut(): Promise<void> {
    return firebase.signOut();
  }

  getCurrentUser(): AuthUser | null {
    return firebase.getCurrentUser();
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebase.onAuthStateChanged(callback);
  }
}
