import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme, height: number) {
  return StyleSheet.create({
    track: {
      width: "100%",
      height,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surfaceTertiary,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: theme.radius.pill,
    },
  });
}
