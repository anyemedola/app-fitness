import { useTheme } from "@app-fitness/theme";
import { Avatar, Icon } from "@app-fitness/ui";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getMember } from "../../data/local/groupsSeed";
import { useAddComment, useComments } from "../hooks/useFeed";

export function CommentsSheet({
  groupId,
  postId,
  onClose,
}: {
  groupId: string;
  postId: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const comments = useComments(groupId, postId);
  const addComment = useAddComment(groupId);
  const [text, setText] = useState("");

  const send = async () => {
    const value = text.trim();
    if (!value) return;
    setText("");
    await addComment(postId, value);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Comentários · {comments.length}</Text>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Seja o primeiro a comentar 🎉</Text>}
          renderItem={({ item }) => {
            const author = getMember(item.authorId);
            return (
              <View style={styles.commentRow}>
                <Avatar initials={author?.initials ?? "?"} hue={author?.hue ?? 200} size={34} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentAuthor}>{author?.name ?? "Alguém"}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            );
          }}
        />
        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escreva um comentário…"
            placeholderTextColor={theme.colors.textFaint}
            style={styles.input}
            onSubmitEditing={send}
          />
          <Pressable style={styles.sendButton} onPress={send} accessibilityLabel="Enviar">
            <Icon name="send" size={19} color={theme.colors.accentInk} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    scrim: { flex: 1, backgroundColor: theme.colors.scrim },
    sheet: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: "78%",
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      paddingBottom: theme.spacing.lg,
    },
    handle: { width: 40, height: 5, borderRadius: 99, backgroundColor: theme.colors.surfaceTertiary, alignSelf: "center", marginTop: 12 },
    title: {
      textAlign: "center",
      marginTop: 12,
      marginBottom: 8,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      fontFamily: theme.typography.fontFamily.display,
      fontWeight: "700",
      fontSize: 17,
      color: theme.colors.text,
    },
    list: { paddingHorizontal: 18, paddingVertical: 14, gap: 16 },
    empty: { textAlign: "center", fontFamily: theme.typography.fontFamily.body, fontSize: 14, color: theme.colors.textFaint, paddingVertical: 20 },
    commentRow: { flexDirection: "row", gap: 10 },
    commentAuthor: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 14.5, color: theme.colors.text },
    commentText: { marginTop: 2, fontFamily: theme.typography.fontFamily.body, fontSize: 14, color: theme.colors.text },
    composer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 99,
      paddingVertical: 11,
      paddingHorizontal: 16,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: 14,
      color: theme.colors.text,
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
