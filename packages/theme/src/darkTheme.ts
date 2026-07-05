import { palette, radius, spacing, typography } from "./tokens";
import type { Theme } from "./types";

/** Dark mode — "Stormy Teal" night surface, ported from `ui.jsx#buildTheme({ dark: true })`. */
export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "#0F2E2B",
    backgroundTop: "#164039",
    surface: "#173F3A",
    surfaceSecondary: "#1C4A44",
    surfaceTertiary: "#255A53",
    text: palette.cream,
    textMuted: "#A7C1BA",
    textFaint: "#6E8C84",
    border: "rgba(246,242,234,0.10)",
    borderStrong: "rgba(246,242,234,0.18)",
    accent: palette.cherryBlossom,
    accentInk: palette.cherryBlossomInk,
    accentSoft: "rgba(239,168,172,0.20)",
    accentLine: "rgba(239,168,172,0.48)",
    scrim: "rgba(9,32,29,0.62)",
    success: "#6BC79A",
    danger: "#E58077",
  },
  spacing,
  radius,
  typography,
  shadows: {
    sm: {
      shadowColor: "#061A18",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 3,
    },
    md: {
      shadowColor: "#061A18",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 5,
    },
    lg: {
      shadowColor: "#061A18",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.5,
      shadowRadius: 34,
      elevation: 8,
    },
  },
};
