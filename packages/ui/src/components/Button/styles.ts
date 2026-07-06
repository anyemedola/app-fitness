import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: theme.radius.md,
      paddingVertical: 15,
      paddingHorizontal: theme.spacing.lg,
    },
    fullWidth: {
      width: "100%",
    },
    sizeSm: {
      paddingVertical: 10,
      paddingHorizontal: theme.spacing.base,
      borderRadius: theme.radius.sm,
    },
    primary: {
      backgroundColor: theme.colors.accent,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    done: {
      backgroundColor: theme.colors.surfaceTertiary,
    },
    disabled: {
      opacity: 0.5,
    },
    label: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.lg,
    },
    labelSm: {
      fontSize: theme.typography.size.base,
    },
    labelPrimary: {
      color: theme.colors.accentInk,
    },
    labelSecondary: {
      color: theme.colors.text,
    },
    labelGhost: {
      color: theme.colors.accent,
    },
    labelDone: {
      color: theme.colors.textMuted,
    },
  });
}
