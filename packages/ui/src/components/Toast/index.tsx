import { useTheme } from "@app-fitness/theme";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Text } from "react-native";

import { createStyles } from "./styles";

export interface ToastProps {
  message: string | null;
}

/** Ephemeral confirmation bubble ("💧 +250 ml registrado") shown above the tab bar. */
export function Toast({ message }: ToastProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [message, opacity]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.wrapper, { opacity }]} pointerEvents="none">
      <Animated.View style={styles.bubble}>
        <Text style={styles.label}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}
