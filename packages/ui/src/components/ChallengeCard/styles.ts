import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      padding: 13,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontFamily: theme.typography.fontFamily.bodyMedium,
      fontSize: theme.typography.size.md,
      color: theme.colors.text,
    },
    progressRow: {
      marginTop: 7,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    progressBarWrap: {
      flex: 1,
    },
    progressLabel: {
      fontFamily: theme.typography.fontFamily.display,
      fontSize: 12.5,
      color: theme.colors.textMuted,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.accent,
    },
    actionButtonDone: {
      backgroundColor: theme.colors.surfaceTertiary,
    },
    actionLabel: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: 13,
      color: theme.colors.accentInk,
    },
    actionLabelDone: {
      color: theme.colors.textMuted,
    },
  });
}
