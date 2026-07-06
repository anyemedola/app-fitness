import { StyleSheet } from "react-native";

export function createStyles(size: number, horizontal: boolean) {
  return StyleSheet.create({
    box: horizontal ? { width: size } : { height: size },
  });
}
