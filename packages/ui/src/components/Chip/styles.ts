import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    active: {
      borderColor: "transparent",
      backgroundColor: theme.colors.accent,
    },
    label: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.base,
      color: theme.colors.text,
    },
    labelActive: {
      color: theme.colors.accentInk,
    },
  });
}
