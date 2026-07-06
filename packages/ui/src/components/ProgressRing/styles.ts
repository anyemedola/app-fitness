import { StyleSheet } from "react-native";

export function createStyles(size: number) {
  return StyleSheet.create({
    wrapper: {
      width: size,
      height: size,
    },
    center: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
