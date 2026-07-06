import { useTheme } from "@app-fitness/theme";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { Avatar } from "../Avatar";

import { createStyles } from "./styles";

export interface AvatarStackUser {
  id: string;
  initials: string;
  hue: number;
}

export interface AvatarStackProps {
  users: AvatarStackUser[];
  size?: number;
  max?: number;
}

/** Overlapping row of member avatars with a "+N" overflow badge, used on group cards. */
export function AvatarStack({ users, size = 26, max = 4 }: AvatarStackProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);
  const list = users.slice(0, max);
  const extra = users.length - max;

  return (
    <View style={styles.row}>
      {list.map((user, i) => (
        <View key={user.id} style={i === 0 ? styles.first : styles.overlap}>
          <Avatar initials={user.initials} hue={user.hue} size={size} />
        </View>
      ))}
      {extra > 0 ? (
        <View style={styles.extra}>
          <Text style={styles.extraLabel}>+{extra}</Text>
        </View>
      ) : null}
    </View>
  );
}
