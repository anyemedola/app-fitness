import { useTheme } from "@app-fitness/theme";
import { Avatar, Icon } from "@app-fitness/ui";
import { formatRelativeTime } from "@app-fitness/utils";
import type { FeedPost } from "@app-fitness/firebase";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { getMember } from "../../data/local/groupsSeed";

import { ReactionBar } from "./ReactionBar";

export function FeedCard({
  post,
  commentCount,
  onReact,
  onOpenComments,
}: {
  post: FeedPost;
  commentCount: number;
  onReact: (emoji: string) => void;
  onOpenComments: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const author = getMember(post.authorId);

  if (post.kind === "join") {
    return (
      <View style={styles.joinRow}>
        <Avatar initials={author?.initials ?? "?"} hue={author?.hue ?? 200} size={28} />
        <Text style={styles.joinText}>
          <Text style={styles.joinName}>{author?.name ?? "Alguém"}</Text> {post.text}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar initials={author?.initials ?? "?"} hue={author?.hue ?? 200} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{author?.name ?? "Alguém"}</Text>
          <Text style={styles.time}>{formatRelativeTime(new Date(post.createdAt))} atrás</Text>
        </View>
      </View>
      {post.text ? <Text style={styles.body}>{post.text}</Text> : null}
      {post.photoUrl ? (
        <View style={styles.photoWrap}>
          <Image source={{ uri: post.photoUrl }} style={styles.photo} />
          <View style={styles.photoBadge}>
            <Icon name="check" size={13} color="#fff" strokeWidth={3} />
            <Text style={styles.photoBadgeLabel}>comprovação</Text>
          </View>
        </View>
      ) : null}
      <ReactionBar
        reactions={post.reactions}
        commentCount={commentCount}
        onReact={onReact}
        onOpenComments={onOpenComments}
      />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: { flexDirection: "row", alignItems: "center", gap: 10 },
    name: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 16, color: theme.colors.text },
    time: { fontFamily: theme.typography.fontFamily.mono, fontSize: 10.5, color: theme.colors.textFaint },
    body: { marginTop: 11, fontFamily: theme.typography.fontFamily.body, fontSize: 14.5, lineHeight: 20, color: theme.colors.text },
    photoWrap: { marginTop: 11, borderRadius: 16, overflow: "hidden" },
    photo: { width: "100%", height: 210, backgroundColor: theme.colors.surfaceTertiary },
    photoBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: 99,
      backgroundColor: theme.colors.scrim,
    },
    photoBadgeLabel: { fontFamily: theme.typography.fontFamily.body, fontWeight: "600", fontSize: 11, color: "#fff" },
    joinRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    joinText: { flex: 1, fontFamily: theme.typography.fontFamily.body, fontSize: 13.5, color: theme.colors.textMuted },
    joinName: { fontFamily: theme.typography.fontFamily.bodyBold, color: theme.colors.text },
  });
}
