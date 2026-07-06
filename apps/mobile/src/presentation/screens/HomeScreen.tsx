import { useTheme } from "@app-fitness/theme";
import { AvatarStack, ChallengeCard, Icon, ProgressRing, SectionTitle } from "@app-fitness/ui";
import { formatDayHeader, toPercent } from "@app-fitness/utils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTodayChallenges } from "../hooks/useChallenges";
import { useDailyStats } from "../hooks/useDailyStats";
import { useFeed } from "../hooks/useFeed";
import { useActiveGroup, useMembers } from "../hooks/useGroups";
import { useQuickAction } from "../hooks/useQuickAction";
import { useSessionStore } from "../stores/sessionStore";
import { toUiKind } from "../utils/challengeKind";
import { FeedCardCompact } from "../components/FeedCardCompact";

function ChallengeRow({ challengeId }: { challengeId: string }) {
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
      icon={kindIcon(challenge.kind)}
      progress={quickAction.progress}
      progressLabel={quickAction.label}
      action={quickAction.action}
      onPress={() => router.push(`/challenge/${challenge.id}`)}
    />
  );
}

function kindIcon(kind: string) {
  switch (kind) {
    case "WATER":
      return "drop" as const;
    case "PHOTO":
      return "leaf" as const;
    case "COUNT":
      return "dumbbell" as const;
    case "STREAK":
      return "flame" as const;
    default:
      return "sun" as const;
  }
}

export function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useSessionStore((s) => s.user);
  const { group } = useActiveGroup();
  const { data: members } = useMembers(group?.memberIds ?? []);
  const { data: challenges } = useTodayChallenges(group?.id);
  const { data: stats } = useDailyStats(group?.id);
  const { posts } = useFeed(group?.id ?? "suor");

  const firstName = user?.displayName?.split(" ")[0] ?? "Atleta";
  const pct = stats?.completionPct ?? 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <Text style={styles.dateLabel}>{formatDayHeader().toUpperCase()}</Text>
        <Pressable style={styles.bellButton} onPress={() => router.push("/history")}>
          <Icon name="bell" size={19} color={theme.colors.text} strokeWidth={2.1} />
          <View style={styles.dot} />
        </Pressable>
      </View>
      <Text style={styles.greeting}>E aí, {firstName} 👋</Text>

      <Pressable style={styles.groupSwitcher} onPress={() => router.push("/groups")}>
        <Text style={styles.groupEmoji}>{group?.emoji ?? "🔥"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.groupEyebrow}>GRUPO ATIVO</Text>
          <Text style={styles.groupName}>{group?.name ?? "Carregando..."}</Text>
        </View>
        {members ? <AvatarStack users={members} size={24} max={3} /> : null}
        <Icon name="chevron" size={18} color={theme.colors.textFaint} strokeWidth={2.2} />
      </Pressable>

      <View style={styles.heroCard}>
        <ProgressRing value={pct} size={92} strokeWidth={9}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.heroPct}>{toPercent(pct)}%</Text>
            <Text style={styles.heroPctLabel}>HOJE</Text>
          </View>
        </ProgressRing>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroCount}>
            {stats?.completedChallenges ?? 0} de {stats?.totalChallenges ?? 0} desafios batidos
          </Text>
          <Text style={styles.heroHint}>Bora fechar o dia 100%. Falta pouco!</Text>
          <View style={styles.streakPill}>
            <Icon name="flame" size={16} filled color={theme.colors.text} strokeWidth={2} />
            <Text style={styles.streakLabel}>{stats?.streakDays ?? 0} dias seguidos</Text>
          </View>
        </View>
      </View>

      <View>
        <SectionTitle action="+ Novo" onAction={() => router.push("/create")}>
          Desafios de hoje
        </SectionTitle>
        <View style={{ gap: 10 }}>
          {(challenges ?? []).map((c) => (
            <ChallengeRow key={c.id} challengeId={c.id} />
          ))}
        </View>
      </View>

      <View>
        <SectionTitle action="Ver feed" onAction={() => router.push("/(tabs)/feed")}>
          Atividade do grupo
        </SectionTitle>
        <View style={{ gap: 10 }}>
          {posts.slice(0, 2).map((post) => (
            <FeedCardCompact key={post.id} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.base, paddingTop: theme.spacing.xxxl, gap: theme.spacing.xl },
    topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    dateLabel: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: theme.typography.size.sm,
      letterSpacing: theme.typography.letterSpacing.trackedWide,
      color: theme.colors.textFaint,
    },
    bellButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    dot: {
      position: "absolute",
      top: 7,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.accent,
    },
    greeting: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: theme.typography.size.displayLg,
      color: theme.colors.text,
    },
    groupSwitcher: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    groupEmoji: { fontSize: 22 },
    groupEyebrow: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: 10,
      letterSpacing: 1,
      color: theme.colors.textFaint,
    },
    groupName: { fontFamily: theme.typography.fontFamily.display, fontSize: 18, color: theme.colors.text },
    heroCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      padding: 18,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    heroPct: { fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 26, color: theme.colors.text },
    heroPctLabel: { fontFamily: theme.typography.fontFamily.mono, fontSize: 9, color: theme.colors.textFaint },
    heroCount: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 15, color: theme.colors.text },
    heroHint: { marginTop: 4, fontFamily: theme.typography.fontFamily.body, fontSize: 13.5, color: theme.colors.textMuted },
    streakPill: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      alignSelf: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: 99,
      backgroundColor: theme.colors.accentSoft,
    },
    streakLabel: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 14, color: theme.colors.text },
  });
}
