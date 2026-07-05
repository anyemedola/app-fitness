import { palette, radius, spacing, typography } from "./tokens";
import type { Theme } from "./types";

/** Light mode — "Dry Sage" surface, ported from `ui.jsx#buildTheme({ dark: false })`. */
export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "#EEF2E4",
    backgroundTop: "#E3EAD1",
    surface: "#FFFFFF",
    surfaceSecondary: "#EEF2E4",
    surfaceTertiary: "#DFE7C9",
    text: palette.cherryBlossomInk,
    textMuted: "#5A6863",
    textFaint: "#A6928F",
    border: "rgba(18,59,55,0.10)",
    borderStrong: "rgba(18,59,55,0.18)",
    accent: palette.cherryBlossom,
    accentInk: palette.cherryBlossomInk,
    accentSoft: "rgba(239,168,172,0.20)",
    accentLine: "rgba(239,168,172,0.48)",
    scrim: "rgba(18,59,55,0.5)",
    success: "#3E8F6B",
    danger: "#C1524A",
  },
  spacing,
  radius,
  typography,
  shadows: {
    sm: {
      shadowColor: "#14302D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    md: {
      shadowColor: "#14302D",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
    lg: {
      shadowColor: "#14302D",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.12,
      shadowRadius: 34,
      elevation: 8,
    },
  },
};
