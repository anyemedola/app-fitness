import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";

import { Icon } from "../Icon";
import type { IconName } from "../../types";

import { createStyles } from "./styles";

export interface DailyCheckProps {
  /** e.g. "Marcar como feito", "Concluído hoje — desfazer", "Mantive hoje (dia 5)". */
  label: string;
  icon?: IconName;
  done?: boolean;
  onPress: () => void;
}

/** Single wide toggle button used by streak ("Sem açúcar 7 dias") and yes/no ("Treino antes das 8h") challenges. */
export function DailyCheck({ label, icon = "check", done = false, onPress }: DailyCheckProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const color = done ? theme.colors.text : theme.colors.accentInk;

  return (
    <Pressable onPress={onPress} style={[styles.button, done && styles.buttonDone]}>
      <Icon name={icon} size={20} color={color} strokeWidth={icon === "flame" ? 2 : 3} filled={icon === "flame"} />
      <Text style={[styles.label, done && styles.labelDone]}>{label}</Text>
    </Pressable>
  );
}
