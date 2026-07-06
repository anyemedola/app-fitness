import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme, size: number) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    overlap: {
      marginLeft: -size * 0.34,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    first: {
      marginLeft: 0,
    },
    extra: {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginLeft: -size * 0.34,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceTertiary,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    extraLabel: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      color: theme.colors.textMuted,
      fontSize: size * 0.36,
    },
  });
}
