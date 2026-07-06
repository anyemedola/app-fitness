import { useTheme } from "@app-fitness/theme";
import { clampRatio } from "@app-fitness/utils";
import React, { useMemo } from "react";
import { View } from "react-native";

import { createStyles } from "./styles";

export interface ProgressBarProps {
  /** Ratio between 0 and 1. Values outside the range are clamped. */
  value: number;
  height?: number;
  color?: string;
  testID?: string;
}

/** Linear progress indicator used in challenge rows and profile cards. */
export function ProgressBar({ value, height = 8, color, testID }: ProgressBarProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, height), [theme, height]);
  const pct = clampRatio(value) * 100;
  return (
    <View style={styles.track} testID={testID}>
      <View
        testID={testID ? `${testID}-fill` : undefined}
        style={[styles.fill, { width: `${pct}%`, backgroundColor: color ?? theme.colors.accent }]}
      />
    </View>
  );
}
