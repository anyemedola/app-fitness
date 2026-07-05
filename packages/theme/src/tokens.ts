/**
 * Design tokens for the "Blossom Bloom" identity used across the app.
 * Values are ported 1:1 from the design reference's `ui.jsx#buildTheme`
 * (Cherry Blossom accent, Stormy Teal dark surface, Dry Sage light surface).
 */

export const palette = {
  cherryBlossom: "#EFA8AC",
  cherryBlossomInk: "#123B37",
  stormyTeal: "#1A615D",
  drySage: "#B8C897",
  cream: "#F6F2EA",
} as const;

/** 4px-based spacing scale used for padding/gap throughout the UI kit. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

/** Corner radius scale — `xl` (22) is the hero/card radius from the reference (`--radius`). */
export const radius = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  fontFamily: {
    /** Headings, big numbers, section titles — Bricolage Grotesque in the reference. */
    display: "BricolageGrotesque_700Bold",
    displayExtraBold: "BricolageGrotesque_800ExtraBold",
    /** Body copy, buttons, inputs — Hanken Grotesk in the reference. */
    body: "HankenGrotesk_400Regular",
    bodyMedium: "HankenGrotesk_600SemiBold",
    bodyBold: "HankenGrotesk_700Bold",
    /** Eyebrow labels / timestamps ("QUI · 10 JUN", "12 min") — monospace, uppercase, tracked out. */
    mono: "ui-monospace",
  },
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 15.5,
    lg: 17,
    xl: 19,
    display: 26,
    displayLg: 32,
  },
  letterSpacing: {
    tight: 0.2,
    tracked: 1,
    trackedWide: 1.5,
  },
} as const;

export type ThemeMode = "light" | "dark";
