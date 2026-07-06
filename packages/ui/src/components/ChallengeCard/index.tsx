import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { ChallengeIcon } from "../ChallengeIcon";
import { Icon } from "../Icon";
import { ProgressBar } from "../ProgressBar";
import type { ChallengeKind, IconName } from "../../types";
import { hueToColor } from "../../utils/color";

import { createStyles } from "./styles";

export interface ChallengeCardAction {
  label: string;
  icon?: IconName;
  done?: boolean;
  onPress: () => void;
}

export interface ChallengeCardProps {
  title: string;
  kind: ChallengeKind;
  icon: IconName;
  hue?: number;
  /** 0-1 ratio already resolved by the caller's use-case (e.g. water ml / target ml). */
  progress: number;
  /** Human label next to the bar, e.g. "1,4 / 2 L" or "Dia 4 de 7". */
  progressLabel: string;
  action: ChallengeCardAction;
  onPress?: () => void;
}

/**
 * A single challenge row: icon, title, progress bar + label, and a quick-action button
 * (e.g. "+250 ml", "Enviar foto", "Check"). Mirrors `ChallengeRow` from the design reference,
 * but stays presentation-only — progress/label/action come pre-computed from the domain layer.
 */
export function ChallengeCard({ title, kind, icon, hue, progress, progressLabel, action, onPress }: ChallengeCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const barColor = hue != null ? hueToColor(hue, 80, 16) : undefined;

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <ChallengeIcon icon={icon} kind={kind} hue={hue} size={44} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrap}>
            <ProgressBar value={progress} height={6} color={barColor} />
          </View>
          <Text style={styles.progressLabel} numberOfLines={1}>
            {progressLabel}
          </Text>
        </View>
      </View>
      <Pressable onPress={action.onPress} style={[styles.actionButton, action.done && styles.actionButtonDone]}>
        {action.icon ? (
          <Icon
            name={action.icon}
            size={15}
            color={action.done ? theme.colors.textMuted : theme.colors.accentInk}
            strokeWidth={2.5}
          />
        ) : null}
        <Text style={[styles.actionLabel, action.done && styles.actionLabelDone]}>{action.label}</Text>
      </Pressable>
    </Pressable>
  );
}
