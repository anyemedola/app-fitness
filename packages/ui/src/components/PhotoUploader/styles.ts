import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme, height: number) {
  return StyleSheet.create({
    viewfinder: {
      height,
      borderRadius: theme.radius.xl,
      overflow: "hidden",
      backgroundColor: theme.colors.surfaceTertiary,
      alignItems: "center",
      justifyContent: "center",
    },
    corner: {
      position: "absolute",
      width: 26,
      height: 26,
      borderColor: "rgba(255,255,255,0.85)",
    },
    hint: {
      alignItems: "center",
      gap: 8,
    },
    hintLabel: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: theme.typography.size.sm,
      letterSpacing: theme.typography.letterSpacing.tracked,
      color: "rgba(255,255,255,0.9)",
    },
    actionsRow: {
      marginTop: theme.spacing.base,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
    },
    galleryButton: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    shutter: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 5,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterDot: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: theme.colors.accent,
    },
    spacerBox: {
      width: 48,
    },
    preview: {
      width: "100%",
      height,
      borderRadius: theme.radius.xl,
    },
    removeButton: {
      position: "absolute",
      top: theme.spacing.md,
      right: theme.spacing.md,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.colors.scrim,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
