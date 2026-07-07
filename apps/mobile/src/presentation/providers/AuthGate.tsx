import { Redirect, useRootNavigationState, useSegments } from "expo-router";
import React from "react";

import { useAuthSession } from "../hooks/useAuthSession";

/**
 * Redirects between the `(auth)` and `(tabs)` route groups based on Firebase auth state.
 * Rendered as a sibling of the root `<Stack>` (not a wrapper) — `useRootNavigationState().key`
 * is only set once that `<Stack>` has mounted, so gating its own mount on that key would
 * deadlock.
 */
export function AuthGate() {
  const { isSignedIn, hydrating } = useAuthSession();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const inAuthGroup = segments[0] === "(auth)";

  if (!rootNavigationState?.key || hydrating) return null;
  if (!isSignedIn && !inAuthGroup) return <Redirect href="/(auth)/onboarding" />;
  if (isSignedIn && inAuthGroup) return <Redirect href="/(tabs)" />;
  return null;
}
