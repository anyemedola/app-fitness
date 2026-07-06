import { useTheme } from "@app-fitness/theme";
import React, { useMemo, useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { createStyles } from "./styles";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

/** Text field with an optional eyebrow label and error message, styled per the theme tokens. */
export function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError, style]}
        placeholderTextColor={theme.colors.textFaint}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
