import { useTheme } from "@app-fitness/theme";
import { Avatar, ChallengeCard, Header, SectionTitle } from "@app-fitness/ui";
import { formatNumberPtBr } from "@app-fitness/utils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BADGES } from "../../data/local/groupsSeed";
import { useTodayChallenges } from "../hooks/useChallenges";
import { useQuickAction } from "../hooks/useQuickAction";
import { useActiveGroup, useMembers } from "../hooks/useGroups";
import { useSessionStore } from "../stores/sessionStore";
import { toUiKind } from "../utils/challengeKind";

function ChallengeSummaryRow({ challengeId }: { challengeId: string }) {
  const router = useRouter();
  const { group } = useActiveGroup();
  const { data: challenges } = useTodayChallenges(group?.id);
  const challenge = challenges?.find((c) => c.id === challengeId);
  const quickAction = useQuickAction(challenge!);
  if (!challenge) return null;
  return (
    <ChallengeCard
      title={challenge.title}
      kind={toUiKind(challenge.kind)}
      icon="target"
      progress={quickAction.progress}
      progressLabel={quickAction.label}
      action={{ label: `${Math.round(quickAction.progress * 100)}%`, done: quickAction.progress >= 1, onPress: () => {} }}
      onPress={() => router.push(`/challenge/${challenge.id}`)}
    />
  );
}

export function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useSessionStore((s) => s.user);
  const { group } = useActiveGroup();
  const { data: members } = useMembers(group?.memberIds ?? []);
  const { data: challenges } = useTodayChallenges(group?.id);

  const me = members?.find((m) => m.id === user?.uid) ?? members?.[0];
  const ranked = [...(members ?? [])].sort((a, b) => b.points - a.points);
  const myRank = me ? ranked.findIndex((m) => m.id === me.id) + 1 : 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Header title="Perfil" trailing={[{ icon: "settings", label: "Ajustes", onPress: () => router.push("/settings") }]} />

      <View style={styles.identity}>
        <Avatar initials={me?.initials ?? user?.displayName?.slice(0, 2).toUpperCase() ?? "?"} hue={me?.hue ?? 200} size={88} ring />
        <Text style={styles.name}>{user?.displayName ?? me?.name ?? "Atleta"}</Text>
        <Text style={styles.handle}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{me?.streak ?? 0}</Text>
          <Text style={styles.statLabel}>SEQUÊNCIA</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatNumberPtBr(me?.points ?? 0)}</Text>
          <Text style={styles.statLabel}>PONTOS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>#{myRank || "-"}</Text>
          <Text style={styles.statLabel}>NO GRUPO</Text>
        </View>
      </View>

      <View>
        <SectionTitle>Conquistas</SectionTitle>
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => (
            <View key={b.id} style={[styles.badge, !b.earned && styles.badgeLocked]}>
              <Text style={styles.badgeLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <SectionTitle>Meus desafios ativos</SectionTitle>
        <View style={{ gap: 10 }}>
          {(challenges ?? []).map((c) => (
            <ChallengeSummaryRow key={c.id} challengeId={c.id} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.base, gap: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
    identity: { alignItems: "center", paddingTop: 4 },
    name: { marginTop: 14, fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 26, color: theme.colors.text },
    handle: { fontFamily: theme.typography.fontFamily.mono, fontSize: 12, color: theme.colors.textFaint },
    statsRow: {
      flexDirection: "row",
      padding: 18,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    stat: { flex: 1, alignItems: "center" },
    statDivider: { width: 1, backgroundColor: theme.colors.border },
    statValue: { fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 26, color: theme.colors.text },
    statLabel: { marginTop: 5, fontFamily: theme.typography.fontFamily.mono, fontSize: 9.5, letterSpacing: 0.8, color: theme.colors.textFaint },
    badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    badge: {
      width: "31%",
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    badgeLocked: { opacity: 0.5, borderStyle: "dashed" },
    badgeLabel: { marginTop: 8, textAlign: "center", fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 11.5, color: theme.colors.text },
  });
}
