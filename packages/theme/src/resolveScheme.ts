export type ThemePreference = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

/**
 * Pure resolution of the effective color scheme from a user preference and the
 * OS color scheme. Kept side-effect free so it can be unit tested without
 * mounting React Native (the system scheme itself comes from `useColorScheme()`).
 */
export function resolveScheme(
  preference: ThemePreference,
  systemScheme: ColorScheme | null | undefined,
): ColorScheme {
  if (preference === "system") {
    return systemScheme ?? "light";
  }
  return preference;
}
