import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

import { Icon } from "../Icon";
import type { IconName } from "../../types";

import { createStyles } from "./styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "done";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantStyleKey: Record<ButtonVariant, "primary" | "secondary" | "ghost" | "done"> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  done: "done",
};

const labelStyleKey: Record<ButtonVariant, "labelPrimary" | "labelSecondary" | "labelGhost" | "labelDone"> = {
  primary: "labelPrimary",
  secondary: "labelSecondary",
  ghost: "labelGhost",
  done: "labelDone",
};

/** Primary CTA used across the app: solid accent, outlined secondary, ghost link, and a muted "done" state. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = true,
  disabled = false,
  onPress,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const iconColor = labelStyleKey[variant] === "labelPrimary" ? theme.colors.accentInk : theme.colors[
    variant === "ghost" ? "accent" : variant === "done" ? "textMuted" : "text"
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        size === "sm" && styles.sizeSm,
        fullWidth && styles.fullWidth,
        styles[variantStyleKey[variant]],
        (disabled || loading) && styles.disabled,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={size === "sm" ? 15 : 20} color={iconColor} strokeWidth={2.4} /> : null}
          <Text style={[styles.label, size === "sm" && styles.labelSm, styles[labelStyleKey[variant]]]}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  );
}
