import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { createStyles } from "./styles";

export interface SectionTitleProps {
  children: string;
  /** Optional trailing link label, e.g. "+ Novo" or "Ver feed". */
  action?: string;
  onAction?: () => void;
}

/** Uppercase section heading with an optional trailing action link. */
export function SectionTitle({ children, action, onAction }: SectionTitleProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        {children}
      </Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
