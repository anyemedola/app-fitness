import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    stepButton: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    stepLabel: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: 26,
      color: theme.colors.text,
    },
    incrementButton: {
      flex: 1,
      height: 52,
      borderRadius: theme.radius.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.accent,
    },
    incrementLabel: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.lg,
      color: theme.colors.accentInk,
    },
    targetButton: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.accentLine,
      backgroundColor: theme.colors.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
