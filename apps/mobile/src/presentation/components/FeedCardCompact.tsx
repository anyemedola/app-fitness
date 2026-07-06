import { useTheme } from "@app-fitness/theme";
import { Avatar } from "@app-fitness/ui";
import { formatRelativeTime } from "@app-fitness/utils";
import type { FeedPost } from "@app-fitness/firebase";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getMember } from "../../data/local/groupsSeed";

export function FeedCardCompact({ post }: { post: FeedPost }) {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const author = getMember(post.authorId);

  return (
    <Pressable style={styles.row} onPress={() => router.push("/(tabs)/feed")}>
      <Avatar initials={author?.initials ?? "?"} hue={author?.hue ?? 200} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={styles.text} numberOfLines={2}>
          <Text style={styles.name}>{author?.name ?? "Alguém"}</Text> {post.text}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(new Date(post.createdAt))} atrás</Text>
      </View>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 11,
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    text: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: 13.5,
      color: theme.colors.textMuted,
    },
    name: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      color: theme.colors.text,
    },
    time: {
      marginTop: 5,
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: 10,
      color: theme.colors.textFaint,
    },
  });
}
