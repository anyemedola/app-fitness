import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    padded: {
      paddingHorizontal: theme.spacing.base,
    },
  });
}
