import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      gap: 7,
    },
    label: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: theme.typography.size.xs,
      letterSpacing: theme.typography.letterSpacing.tracked,
      color: theme.colors.textFaint,
      textTransform: "uppercase",
    },
    field: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingVertical: 14,
      paddingHorizontal: theme.spacing.base,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.lg,
      color: theme.colors.text,
    },
    fieldFocused: {
      borderColor: theme.colors.accentLine,
    },
    fieldError: {
      borderColor: theme.colors.danger,
    },
    error: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.sm,
      color: theme.colors.danger,
    },
  });
}
