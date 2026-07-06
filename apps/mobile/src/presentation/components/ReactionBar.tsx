import { useTheme } from "@app-fitness/theme";
import { Icon } from "@app-fitness/ui";
import type { FeedReactionMap } from "@app-fitness/firebase";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const REACT_EMOJIS = ["🔥", "💪", "😍", "👏", "💧", "🥗"];

export function ReactionBar({
  reactions,
  commentCount,
  onReact,
  onOpenComments,
}: {
  reactions: FeedReactionMap;
  commentCount: number;
  onReact: (emoji: string) => void;
  onOpenComments: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [picker, setPicker] = useState(false);
  const entries = Object.entries(reactions).filter(([, n]) => n > 0);

  return (
    <View style={styles.row}>
      {entries.map(([emoji, count]) => (
        <Pressable key={emoji} style={styles.pill} onPress={() => onReact(emoji)}>
          <Text style={styles.pillEmoji}>{emoji}</Text>
          <Text style={styles.pillCount}>{count}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.reactButton} onPress={() => setPicker((p) => !p)} accessibilityLabel="Reagir">
        <Icon name="heart" size={16} color={theme.colors.textMuted} strokeWidth={2.2} />
      </Pressable>
      <Pressable style={styles.commentsButton} onPress={onOpenComments}>
        <Icon name="comment" size={17} color={theme.colors.textMuted} strokeWidth={2.1} />
        <Text style={styles.commentsLabel}>{commentCount > 0 ? commentCount : "Comentar"}</Text>
      </Pressable>

      {picker && (
        <View style={styles.picker}>
          {REACT_EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              style={styles.pickerButton}
              onPress={() => {
                onReact(emoji);
                setPicker(false);
              }}
            >
              <Text style={styles.pickerEmoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    row: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", position: "relative" },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    pillEmoji: { fontSize: 14 },
    pillCount: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 13, color: theme.colors.text },
    reactButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    commentsButton: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 6 },
    commentsLabel: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: 13, color: theme.colors.textMuted },
    picker: {
      position: "absolute",
      bottom: 40,
      left: 0,
      zIndex: 5,
      flexDirection: "row",
      gap: 4,
      padding: 6,
      borderRadius: 99,
      backgroundColor: theme.colors.surfaceTertiary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.md,
    },
    pickerButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
    pickerEmoji: { fontSize: 19 },
  });
}
