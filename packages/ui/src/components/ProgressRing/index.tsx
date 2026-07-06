import { useTheme } from "@app-fitness/theme";
import { clampRatio } from "@app-fitness/utils";
import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { createStyles } from "./styles";

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

/** Circular progress ring (SVG) with centered content, used for "today %" and challenge hero stats. */
export function ProgressRing({
  value,
  size = 56,
  strokeWidth = 6,
  color,
  trackColor,
  children,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(size), [size]);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampRatio(value));

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor ?? theme.colors.surfaceTertiary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color ?? theme.colors.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}
