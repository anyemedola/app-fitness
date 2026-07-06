import { useTheme } from "@app-fitness/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";

import { hueToColor } from "../../utils/color";

import { createStyles } from "./styles";

export interface AvatarProps {
  initials: string;
  /** 0-360 hue used to derive a per-user gradient, mirrors the reference's `oklch(.., hue)`. */
  hue: number;
  size?: number;
  /** Highlights the avatar with an accent ring, used to mark "you" in rankings. */
  ring?: boolean;
  imageUri?: string;
}

/** Circular user avatar: a real photo when available, otherwise a colored-gradient initials badge. */
export function Avatar({ initials, hue, size = 40, ring = false, imageUri }: AvatarProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, size, ring), [theme, size, ring]);
  const from = hueToColor(hue, 62, 60);
  const to = hueToColor(hue, 48, 62);

  return (
    <View style={styles.wrapper}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <LinearGradient colors={[from, to]} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}
