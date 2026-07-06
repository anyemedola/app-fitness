import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme, size: number, ring: boolean) {
  return StyleSheet.create({
    wrapper: {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      ...(ring
        ? {
            borderWidth: 2,
            borderColor: theme.colors.accent,
          }
        : null),
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    initials: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      color: "#FFFFFF",
      fontSize: size * 0.38,
      letterSpacing: 0.3,
    },
  });
}
