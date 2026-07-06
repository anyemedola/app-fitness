import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { View, type ViewProps } from "react-native";

import { createStyles } from "./styles";

export interface ContainerProps extends ViewProps {
  /** Adds horizontal screen padding (16px). Defaults to true. */
  padded?: boolean;
}

/** Full-height screen wrapper that paints the current theme's background. */
export function Container({ padded = true, style, children, ...rest }: ContainerProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={[styles.base, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}
