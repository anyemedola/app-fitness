import { useTheme } from "@app-fitness/theme";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Icon } from "../Icon";

import { createStyles } from "./styles";

export interface PhotoUploaderProps {
  /** Currently captured/selected photo URI, or null before capture. Controlled by the caller. */
  photoUri: string | null;
  onCapture: (uri: string) => void;
  onRemove?: () => void;
  label?: string;
  height?: number;
}

const CORNER_POSITIONS = [
  { top: 14, left: 14, borderTopWidth: 3, borderLeftWidth: 3 },
  { top: 14, right: 14, borderTopWidth: 3, borderRightWidth: 3 },
  { bottom: 14, left: 14, borderBottomWidth: 3, borderLeftWidth: 3 },
  { bottom: 14, right: 14, borderBottomWidth: 3, borderRightWidth: 3 },
] as const;

/** Camera/gallery capture surface used to prove challenge completion (e.g. a salad photo). */
export function PhotoUploader({
  photoUri,
  onCapture,
  onRemove,
  label = "aponte para o prato",
  height = 320,
}: PhotoUploaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, height), [theme, height]);

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [3, 4] });
    if (!result.canceled && result.assets[0]) onCapture(result.assets[0].uri);
  }, [onCapture]);

  const pickFromGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [3, 4] });
    if (!result.canceled && result.assets[0]) onCapture(result.assets[0].uri);
  }, [onCapture]);

  if (photoUri) {
    return (
      <View>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        {onRemove ? (
          <Pressable onPress={onRemove} accessibilityLabel="Remover foto" style={styles.removeButton}>
            <Icon name="chevronLeft" size={16} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.viewfinder}>
        {CORNER_POSITIONS.map((pos, i) => (
          <View key={i} style={[styles.corner, pos]} />
        ))}
        <View style={styles.hint}>
          <Icon name="camera" size={40} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
          <Text style={styles.hintLabel}>{label}</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <Pressable onPress={pickFromGallery} accessibilityLabel="Escolher da galeria" style={styles.galleryButton}>
          <Icon name="share" size={22} color={theme.colors.textMuted} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={takePhoto} accessibilityLabel="Tirar foto" style={styles.shutter}>
          <View style={styles.shutterDot} />
        </Pressable>
        <View style={styles.spacerBox} />
      </View>
    </View>
  );
}
