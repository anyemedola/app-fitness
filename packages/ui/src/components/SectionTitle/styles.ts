import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    title: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: theme.typography.size.xl,
      letterSpacing: theme.typography.letterSpacing.tight,
      color: theme.colors.text,
      textTransform: "uppercase",
    },
    action: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.base,
      color: theme.colors.accent,
    },
  });
}
