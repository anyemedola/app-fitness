import { Redirect, useSegments } from "expo-router";
import React from "react";

import { useAuthSession } from "../hooks/useAuthSession";

/** Redirects between the `(auth)` and `(tabs)` route groups based on Firebase auth state. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, hydrating } = useAuthSession();
  const segments = useSegments();
  const inAuthGroup = segments[0] === "(auth)";

  if (hydrating) return null;
  if (!isSignedIn && !inAuthGroup) return <Redirect href="/(auth)/onboarding" />;
  if (isSignedIn && inAuthGroup) return <Redirect href="/(tabs)" />;
  return <>{children}</>;
}
