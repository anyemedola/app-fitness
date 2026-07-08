import { useEffect, useState } from "react";

import { authRepository } from "../../infra/container";
import { useSessionStore } from "../stores/sessionStore";

/** Subscribes to Firebase auth state once and mirrors it into the session store. */
export function useAuthSession() {
  const [hydrating, setHydrating] = useState(true);
  const user = useSessionStore((s) => s.user);
  const setUser = useSessionStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((next) => {
      setUser(next);
      setHydrating(false);
    });
    return unsubscribe;
  }, [setUser]);

  return { user, hydrating, isSignedIn: Boolean(user) };
}

export function useSignInWithGoogle() {
  const setUser = useSessionStore((s) => s.setUser);
  return async () => setUser(await authRepository.signInWithGoogle());
}

export function useSignInWithApple() {
  const setUser = useSessionStore((s) => s.setUser);
  return async () => setUser(await authRepository.signInWithApple());
}

export function useSignInAnonymously() {
  const setUser = useSessionStore((s) => s.setUser);
  return async () => setUser(await authRepository.signInAnonymously());
}

export function useSignOut() {
  const setUser = useSessionStore((s) => s.setUser);
  return async () => {
    await authRepository.signOut();
    setUser(null);
  };
}
