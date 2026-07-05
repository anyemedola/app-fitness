import type { ViewStyle } from "react-native";

import { radius, spacing, typography } from "./tokens";

export interface ThemeColors {
  background: string;
  backgroundTop: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  accentLine: string;
  scrim: string;
  success: string;
  danger: string;
}

export type ThemeShadowStyle = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export interface ThemeShadows {
  sm: ThemeShadowStyle;
  md: ThemeShadowStyle;
  lg: ThemeShadowStyle;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: ThemeShadows;
}
