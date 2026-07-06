import { useTheme } from "@app-fitness/theme";
import { Chip, Header } from "@app-fitness/ui";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { CommentsSheet } from "../components/CommentsSheet";
import { FeedCard } from "../components/FeedCard";
import { useToggleReaction, useFeed } from "../hooks/useFeed";
import { useActiveGroup } from "../hooks/useGroups";
import { useSessionStore } from "../stores/sessionStore";

type Filter = "tudo" | "fotos" | "conquistas";

export function FeedScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const groupId = group?.id ?? "suor";
  const { posts } = useFeed(groupId);
  const toggleReaction = useToggleReaction(groupId);
  const userId = useSessionStore((s) => s.user?.uid);
  const [filter, setFilter] = useState<Filter>("tudo");
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const filtered = posts.filter((post) => {
    if (filter === "fotos") return post.kind === "photo";
    if (filter === "conquistas") return post.kind === "streak" || post.kind === "yesno";
    return true;
  });

  return (
    <View style={styles.container}>
      <Header title={group?.name ?? "Feed"} subtitle="feed" large={false} />
      <View style={styles.chips}>
        <Chip active={filter === "tudo"} onPress={() => setFilter("tudo")}>
          Tudo
        </Chip>
        <Chip active={filter === "fotos"} icon="camera" onPress={() => setFilter("fotos")}>
          Fotos
        </Chip>
        <Chip active={filter === "conquistas"} icon="flame" onPress={() => setFilter("conquistas")}>
          Conquistas
        </Chip>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(post) => post.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FeedCard
            post={item}
            commentCount={0}
            onReact={(emoji) => userId && toggleReaction(item.id, emoji)}
            onOpenComments={() => setOpenPostId(item.id)}
          />
        )}
      />
      {openPostId && <CommentsSheet groupId={groupId} postId={openPostId} onClose={() => setOpenPostId(null)} />}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    chips: { flexDirection: "row", gap: 8, paddingHorizontal: theme.spacing.base, paddingBottom: 4 },
    list: { padding: theme.spacing.base, gap: theme.spacing.md },
  });
}
