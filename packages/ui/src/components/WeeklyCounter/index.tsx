import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { Icon } from "../Icon";

import { createStyles } from "./styles";

export interface WeeklyCounterProps {
  /** Label shown on the increment button, e.g. "+ 10 reps" or "+ 250 ml". */
  incrementLabel: string;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Jumps straight to the target (the reference's "bater meta" shortcut). */
  onHitTarget: () => void;
}

/** Stepper control for count-style challenges (weekly reps) and incremental ones (daily water). */
export function WeeklyCounter({ incrementLabel, onIncrement, onDecrement, onHitTarget }: WeeklyCounterProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <Pressable onPress={onDecrement} accessibilityLabel="Diminuir" style={styles.stepButton}>
        <Text style={styles.stepLabel}>−</Text>
      </Pressable>
      <Pressable onPress={onIncrement} style={styles.incrementButton}>
        <Text style={styles.incrementLabel}>{incrementLabel}</Text>
      </Pressable>
      <Pressable onPress={onHitTarget} accessibilityLabel="Bater meta" style={styles.targetButton}>
        <Icon name="target" size={22} color={theme.colors.accent} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}
