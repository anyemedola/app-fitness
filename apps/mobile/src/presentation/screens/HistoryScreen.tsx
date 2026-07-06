import { useTheme } from "@app-fitness/theme";
import { Header } from "@app-fitness/ui";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { FeedCard } from "../components/FeedCard";
import { useFeed, useToggleReaction } from "../hooks/useFeed";
import { useActiveGroup } from "../hooks/useGroups";
import { useSessionStore } from "../stores/sessionStore";

/** "Histórico": the current user's own past check-ins/posts in the active group. */
export function HistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const groupId = group?.id ?? "suor";
  const { posts } = useFeed(groupId);
  const toggleReaction = useToggleReaction(groupId);
  const userId = useSessionStore((s) => s.user?.uid);

  const mine = posts.filter((p) => p.authorId === userId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Histórico" subtitle="seus check-ins" back onBack={() => router.back()} />
      <FlatList
        data={mine}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não tem check-ins por aqui.</Text>}
        renderItem={({ item }) => (
          <FeedCard post={item} commentCount={0} onReact={(emoji) => toggleReaction(item.id, emoji)} onOpenComments={() => {}} />
        )}
      />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    list: { padding: theme.spacing.base, gap: theme.spacing.md },
    empty: {
      marginTop: theme.spacing.xl,
      textAlign: "center",
      fontFamily: theme.typography.fontFamily.body,
      fontSize: 14,
      color: theme.colors.textFaint,
    },
  });
}
