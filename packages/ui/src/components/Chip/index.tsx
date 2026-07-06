import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";

import { Icon } from "../Icon";
import type { IconName } from "../../types";

import { createStyles } from "./styles";

export interface ChipProps {
  children: string;
  active?: boolean;
  onPress?: () => void;
  icon?: IconName;
}

/** Pill-shaped filter toggle used on the feed and leaderboard period switchers. */
export function Chip({ children, active = false, onPress, icon }: ChipProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const iconColor = active ? theme.colors.accentInk : theme.colors.text;
  return (
    <Pressable onPress={onPress} style={[styles.base, active && styles.active]}>
      {icon ? <Icon name={icon} size={15} color={iconColor} strokeWidth={2.3} /> : null}
      <Text style={[styles.label, active && styles.labelActive]}>{children}</Text>
    </Pressable>
  );
}
