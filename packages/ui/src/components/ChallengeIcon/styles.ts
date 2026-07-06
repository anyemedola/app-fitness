import { StyleSheet } from "react-native";

export function createStyles(size: number, bg: string) {
  return StyleSheet.create({
    box: {
      width: size,
      height: size,
      borderRadius: size * 0.32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: bg,
    },
  });
}
