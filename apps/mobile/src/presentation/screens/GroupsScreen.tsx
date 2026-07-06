import { useTheme } from "@app-fitness/theme";
import { AvatarStack, Header, ProgressRing } from "@app-fitness/ui";
import { toPercent } from "@app-fitness/utils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useGroups, useMembers } from "../hooks/useGroups";
import { useSessionStore } from "../stores/sessionStore";

function GroupRow({ groupId, active }: { groupId: string; active: boolean }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const setActiveGroupId = useSessionStore((s) => s.setActiveGroupId);
  const { data: groups } = useGroups();
  const group = groups?.find((g) => g.id === groupId);
  const { data: members } = useMembers(group?.memberIds ?? []);
  if (!group) return null;

  return (
    <Pressable
      style={[styles.card, active && styles.cardActive]}
      onPress={() => {
        setActiveGroupId(group.id);
        router.push("/(tabs)/feed");
      }}
    >
      <View style={styles.row}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{group.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {group.name}
            </Text>
            {active ? <Text style={styles.activeTag}>ATIVO</Text> : null}
          </View>
          <Text style={styles.meta}>
            {group.memberIds.length} membros · {group.activeChallenges} desafios ativos
          </Text>
        </View>
      </View>
      <View style={styles.footerRow}>
        {members ? <AvatarStack users={members} size={28} max={5} /> : <View />}
        <View style={styles.pctRow}>
          <ProgressRing value={group.todayPct} size={34} strokeWidth={4}>
            <Text style={styles.pctLabel}>{toPercent(group.todayPct)}</Text>
          </ProgressRing>
          <Text style={styles.pctText}>hoje</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function GroupsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { data: groups } = useGroups();
  const activeGroupId = useSessionStore((s) => s.activeGroupId);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Meus grupos" subtitle="Squad" />
      <ScrollView contentContainerStyle={styles.list}>
        {(groups ?? []).map((g) => (
          <GroupRow key={g.id} groupId={g.id} active={g.id === activeGroupId} />
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    list: { padding: theme.spacing.base, gap: theme.spacing.md },
    card: {
      padding: 16,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    cardActive: { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentSoft },
    row: { flexDirection: "row", alignItems: "center", gap: 13 },
    emojiBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: theme.colors.surfaceTertiary,
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: { fontSize: 26 },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: { flex: 1, fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 19, color: theme.colors.text },
    activeTag: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: 9,
      letterSpacing: 1,
      paddingVertical: 2,
      paddingHorizontal: 7,
      borderRadius: 99,
      backgroundColor: theme.colors.accent,
      color: theme.colors.accentInk,
      overflow: "hidden",
    },
    meta: { marginTop: 2, fontFamily: theme.typography.fontFamily.body, fontSize: 13, color: theme.colors.textMuted },
    footerRow: { marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    pctRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    pctLabel: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 11, color: theme.colors.text },
    pctText: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textFaint },
  });
}
