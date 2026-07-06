import React, { useMemo } from "react";
import { View } from "react-native";

import { Icon } from "../Icon";
import type { ChallengeKind, IconName } from "../../types";
import { hueToColor } from "../../utils/color";

import { createStyles } from "./styles";

/** Default hue per challenge kind, mirrors the reference's `KIND_HUE` fallback map. */
const KIND_HUE: Record<ChallengeKind, number> = {
  water: 230,
  photo: 140,
  count: 30,
  streak: 25,
  yesno: 280,
};

export interface ChallengeIconProps {
  icon: IconName;
  kind: ChallengeKind;
  /** Overrides the kind's default hue — used when a specific challenge has its own accent color. */
  hue?: number;
  size?: number;
  /** Soft (tinted background) for list rows, solid for the challenge detail hero. Defaults to true. */
  soft?: boolean;
}

/** Rounded-square badge that color-codes a challenge by kind (water=blue, photo=green, ...). */
export function ChallengeIcon({ icon, kind, hue, size = 44, soft = true }: ChallengeIconProps) {
  const resolvedHue = hue ?? KIND_HUE[kind];
  const bg = soft ? withAlpha(hueToColor(resolvedHue, 62, 15), 0.35) : hueToColor(resolvedHue, 62, 15);
  const fg = soft ? hueToColor(resolvedHue, 78, 14) : "#FFFFFF";
  const styles = useMemo(() => createStyles(size, bg), [size, bg]);
  const filled = icon === "flame" || icon === "drop";

  return (
    <View style={styles.box}>
      <Icon name={icon} size={size * 0.5} color={fg} strokeWidth={2.2} filled={filled} />
    </View>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
