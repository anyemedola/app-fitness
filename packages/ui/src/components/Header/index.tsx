import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { Icon } from "../Icon";
import type { IconName } from "../../types";

import { createStyles } from "./styles";

export interface HeaderTrailingAction {
  icon: IconName;
  label: string;
  onPress?: () => void;
  dot?: boolean;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  trailing?: HeaderTrailingAction[];
  /** Large (32px) title for top-level tabs vs. compact (24px) for pushed screens. Defaults to true. */
  large?: boolean;
}

/** Screen header: back button, eyebrow subtitle, title, and up to a few trailing icon actions. */
export function Header({ title, subtitle, back = false, onBack, trailing = [], large = true }: HeaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {back ? (
          <Pressable onPress={onBack} accessibilityLabel="Voltar" style={styles.iconButton}>
            <Icon name="chevronLeft" size={20} color={theme.colors.text} strokeWidth={2.4} />
          </Pressable>
        ) : null}
        <View style={styles.titleColumn}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <Text style={[styles.title, !large && styles.titleSmall]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {trailing.map((action, i) => (
          <Pressable
            key={`${action.icon}-${i}`}
            onPress={action.onPress}
            accessibilityLabel={action.label}
            style={styles.iconButton}
          >
            <Icon name={action.icon} size={19} color={theme.colors.text} strokeWidth={2.1} />
            {action.dot ? <View style={styles.dot} /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
