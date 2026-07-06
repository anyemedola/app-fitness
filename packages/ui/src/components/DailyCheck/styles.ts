import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      padding: 15,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.accent,
    },
    buttonDone: {
      backgroundColor: theme.colors.surfaceTertiary,
    },
    label: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.lg,
      color: theme.colors.accentInk,
    },
    labelDone: {
      color: theme.colors.text,
    },
  });
}
