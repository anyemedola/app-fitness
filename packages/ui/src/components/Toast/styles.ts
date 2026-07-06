import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 110,
      alignItems: "center",
    },
    bubble: {
      paddingVertical: 11,
      paddingHorizontal: 18,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surfaceTertiary,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      ...theme.shadows.md,
    },
    label: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.base,
      color: theme.colors.text,
    },
  });
}
