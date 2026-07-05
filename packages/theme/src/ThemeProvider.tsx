import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";
import { resolveScheme, type ThemePreference } from "./resolveScheme";
import type { Theme } from "./types";

const STORAGE_KEY = "@app-fitness/theme-preference";

export interface ThemeContextValue {
  theme: Theme;
  /** "light" | "dark" | "system" — what the user picked in settings. */
  preference: ThemePreference;
  /** Effective "light" | "dark" scheme after resolving "system". */
  scheme: "light" | "dark";
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting the preference is best-effort; the in-memory state still updates.
    });
  }, []);

  const toggle = useCallback(() => {
    const current = resolveScheme(preference, systemScheme as "light" | "dark" | null);
    setPreference(current === "dark" ? "light" : "dark");
  }, [preference, systemScheme, setPreference]);

  const scheme = resolveScheme(preference, systemScheme as "light" | "dark" | null);
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, preference, scheme, setPreference, toggle }),
    [theme, preference, scheme, setPreference, toggle],
  );

  // Render immediately with the best-guess scheme; avoids a flash of the wrong
  // theme while AsyncStorage hydrates, since `preference` defaults to "system".
  void hydrated;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
