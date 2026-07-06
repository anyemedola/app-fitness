import { useTheme } from "@app-fitness/theme";
import { Avatar, DailyCheck, Header, ProgressRing, SectionTitle, WeeklyCounter } from "@app-fitness/ui";
import { formatProgress, toPercent } from "@app-fitness/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getMember } from "../../data/local/groupsSeed";
import { useAddWaterProgress, useAddWeeklyReps, useMarkDailyCheck, useTodayChallenges } from "../hooks/useChallenges";
import { useActiveGroup } from "../hooks/useGroups";

/** Deterministic per-member placeholder score, standing in for a real per-challenge ranking endpoint. */
function placeholderScore(seed: string, target: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  return Math.round((0.3 + (hash % 70) / 100) * target);
}

export function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const { data: challenges } = useTodayChallenges(group?.id);
  const challenge = challenges?.find((c) => c.id === id);
  const addWater = useAddWaterProgress();
  const addReps = useAddWeeklyReps();
  const markCheck = useMarkDailyCheck();

  if (!challenge) {
    return <Header title="Desafio" back onBack={() => router.back()} />;
  }

  const pct = Math.min(1, challenge.value / challenge.target);

  const standings = (group?.memberIds ?? [])
    .map((memberId) => ({
      member: getMember(memberId),
      value: memberId === "lia" ? challenge.value : placeholderScore(memberId + challenge.id, challenge.target),
    }))
    .filter((s): s is { member: NonNullable<ReturnType<typeof getMember>>; value: number } => Boolean(s.member))
    .sort((a, b) => b.value - a.value);

  return (
    <View style={styles.container}>
      <Header
        title={challenge.title}
        subtitle={challenge.cadence}
        back
        onBack={() => router.back()}
        trailing={[{ icon: "share", label: "Compartilhar", onPress: () => {} }]}
        large={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{challenge.cadence}</Text>
          </View>
          {challenge.description ? <Text style={styles.description}>{challenge.description}</Text> : null}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <ProgressRing value={pct} size={76} strokeWidth={8}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.progressValue}>{challenge.value}</Text>
                <Text style={styles.progressTarget}>
                  / {challenge.target}
                  {challenge.unit ? ` ${challenge.unit}` : ""}
                </Text>
              </View>
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressEyebrow}>SEU PROGRESSO</Text>
              <Text style={styles.progressHeadline}>
                {pct >= 1 ? "Meta batida! 🎯" : `${toPercent(pct)}% do caminho`}
              </Text>
            </View>
          </View>

          {challenge.kind === "WATER" && (
            <WeeklyCounter
              incrementLabel="+ 250 ml"
              onDecrement={() => addWater.mutate({ challengeId: challenge.id, delta: -0.25 })}
              onIncrement={() => addWater.mutate({ challengeId: challenge.id, delta: 0.25 })}
              onHitTarget={() => addWater.mutate({ challengeId: challenge.id, delta: challenge.target - challenge.value })}
            />
          )}
          {challenge.kind === "COUNT" && (
            <WeeklyCounter
              incrementLabel="+ 10 reps"
              onDecrement={() => addReps.mutate({ challengeId: challenge.id, reps: -10 })}
              onIncrement={() => addReps.mutate({ challengeId: challenge.id, reps: 10 })}
              onHitTarget={() => addReps.mutate({ challengeId: challenge.id, reps: Math.max(0, challenge.target - challenge.value) })}
            />
          )}
          {challenge.kind === "PHOTO" && (
            <Text style={styles.photoHint} onPress={() => router.push(`/challenge/${challenge.id}/upload`)}>
              📷 Toque para enviar a foto de comprovação
            </Text>
          )}
          {challenge.kind === "STREAK" && (
            <DailyCheck
              icon="flame"
              label={`Mantive hoje (dia ${Math.min(challenge.target, challenge.value + 1)})`}
              onPress={() => markCheck.mutate(challenge.id)}
            />
          )}
          {challenge.kind === "YESNO" && (
            <DailyCheck
              icon="check"
              done={challenge.value >= challenge.target}
              label={challenge.value >= challenge.target ? "Concluído hoje — desfazer" : "Marcar como feito"}
              onPress={() => markCheck.mutate(challenge.id)}
            />
          )}
        </View>

        <View>
          <SectionTitle>Ranking do desafio</SectionTitle>
          <View style={styles.ranking}>
            {standings.map((s, i) => (
              <View key={s.member.id} style={[styles.rankRow, i < standings.length - 1 && styles.rankRowBorder]}>
                <Text style={styles.rankIndex}>{i + 1}</Text>
                <Avatar initials={s.member.initials} hue={s.member.hue} size={34} />
                <Text style={styles.rankName}>{s.member.name}</Text>
                <Text style={styles.rankValue}>{formatProgress(s.value, challenge.target, challenge.unit ?? undefined)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.base, gap: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
    hero: {
      padding: 18,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    badgeRow: { flexDirection: "row", gap: 7 },
    badge: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: 10,
      letterSpacing: 1,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 99,
      backgroundColor: theme.colors.surfaceSecondary,
      color: theme.colors.textMuted,
      overflow: "hidden",
    },
    description: { marginTop: 14, fontFamily: theme.typography.fontFamily.body, fontSize: 14.5, lineHeight: 20, color: theme.colors.text },
    progressCard: {
      padding: 18,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 16,
    },
    progressRow: { flexDirection: "row", alignItems: "center", gap: 16 },
    progressValue: { fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 20, color: theme.colors.text },
    progressTarget: { fontFamily: theme.typography.fontFamily.mono, fontSize: 8.5, color: theme.colors.textFaint },
    progressEyebrow: { fontFamily: theme.typography.fontFamily.mono, fontSize: 10, letterSpacing: 1, color: theme.colors.textFaint },
    progressHeadline: { marginTop: 2, fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 22, color: theme.colors.text },
    photoHint: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: 15, color: theme.colors.accent, textAlign: "center" },
    ranking: { borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, overflow: "hidden" },
    rankRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
    rankRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    rankIndex: { width: 20, textAlign: "center", fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 15, color: theme.colors.textFaint },
    rankName: { flex: 1, fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 15, color: theme.colors.text },
    rankValue: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 14, color: theme.colors.textMuted },
  });
}
