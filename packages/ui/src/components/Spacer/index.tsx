import type { SpacingToken } from "@app-fitness/theme";
import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { View } from "react-native";

import { createStyles } from "./styles";

export interface SpacerProps {
  /** Token from the theme's spacing scale, e.g. "md" (12px) or "lg" (20px). */
  size?: SpacingToken;
  horizontal?: boolean;
}

/** Fixed-size gap for stacking components without ad-hoc margins. */
export function Spacer({ size = "base", horizontal = false }: SpacerProps) {
  const { theme } = useTheme();
  const px = theme.spacing[size];
  const styles = useMemo(() => createStyles(px, horizontal), [px, horizontal]);
  return <View style={styles.box} />;
}
