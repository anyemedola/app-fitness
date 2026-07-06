import { useTheme } from "@app-fitness/theme";
import { Avatar, Chip, Header } from "@app-fitness/ui";
import { formatNumberPtBr } from "@app-fitness/utils";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useActiveGroup, useMembers } from "../hooks/useGroups";
import { useSessionStore } from "../stores/sessionStore";

type Period = "semana" | "mes" | "geral";
const FACTORS: Record<Period, number> = { semana: 0.28, mes: 1, geral: 3.4 };
const MEDAL_COLORS = ["#E8C351", "#C7CAD1", "#C98A4B"];

export function LeaderboardScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const { data: members } = useMembers(group?.memberIds ?? []);
  const currentUserId = useSessionStore((s) => s.user?.uid);
  const [period, setPeriod] = useState<Period>("semana");

  const ranked = (members ?? [])
    .map((m) => ({ ...m, pts: Math.round(m.points * FACTORS[period]) }))
    .sort((a, b) => b.pts - a.pts);
  const top3 = ranked.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as typeof ranked;
  const heights = [104, 78, 62]; // index 0 = 1st place (center), matches podiumOrder mapping below

  return (
    <View style={styles.container}>
      <Header title="Ranking" subtitle={group?.name ?? ""} />
      <View style={styles.chips}>
        <Chip active={period === "semana"} onPress={() => setPeriod("semana")}>
          Semana
        </Chip>
        <Chip active={period === "mes"} onPress={() => setPeriod("mes")}>
          Mês
        </Chip>
        <Chip active={period === "geral"} onPress={() => setPeriod("geral")}>
          Geral
        </Chip>
      </View>

      <View style={styles.podium}>
        {podiumOrder.map((m) => {
          const rank = ranked.findIndex((r) => r.id === m.id);
          return (
            <View key={m.id} style={styles.podiumColumn}>
              <View>
                <Avatar initials={m.initials} hue={m.hue} size={rank === 0 ? 60 : 50} ring={rank === 0} />
                <View style={[styles.medal, { backgroundColor: MEDAL_COLORS[rank] }]}>
                  <Text style={styles.medalLabel}>{rank + 1}</Text>
                </View>
              </View>
              <Text style={styles.podiumName}>{m.name}</Text>
              <Text style={styles.podiumPts}>{formatNumberPtBr(m.pts)} pts</Text>
              <View style={[styles.podiumBar, { height: heights[rank === 0 ? 0 : rank === 1 ? 1 : 2] }]} />
            </View>
          );
        })}
      </View>

      <View style={styles.list}>
        {ranked.slice(3).map((m, i) => {
          const isMe = m.id === currentUserId;
          return (
            <View key={m.id} style={[styles.row, i < ranked.length - 4 && styles.rowBorder, isMe && styles.rowMe]}>
              <Text style={styles.rowRank}>{i + 4}</Text>
              <Avatar initials={m.initials} hue={m.hue} size={36} ring={isMe} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>
                  {m.name}
                  {isMe ? " (você)" : ""}
                </Text>
                <Text style={styles.rowStreak}>🔥 {m.streak} dias</Text>
              </View>
              <Text style={styles.rowPts}>{formatNumberPtBr(m.pts)} pts</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    chips: { flexDirection: "row", gap: 8, paddingHorizontal: theme.spacing.base, paddingBottom: 6 },
    podium: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 12, paddingVertical: 20 },
    podiumColumn: { flex: 1, maxWidth: 104, alignItems: "center" },
    medal: {
      position: "absolute",
      bottom: -6,
      left: "50%",
      marginLeft: -11,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    medalLabel: { fontFamily: theme.typography.fontFamily.display, fontWeight: "800", fontSize: 12, color: "#1a1a1a" },
    podiumName: { marginTop: 12, fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 15, color: theme.colors.text },
    podiumPts: { fontFamily: theme.typography.fontFamily.display, fontWeight: "800", fontSize: 13, color: theme.colors.accent },
    podiumBar: { width: "100%", marginTop: 8, borderRadius: 12, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
    list: { paddingHorizontal: theme.spacing.base, paddingBottom: theme.spacing.xl },
    row: { flexDirection: "row", alignItems: "center", gap: 13, padding: 12, backgroundColor: theme.colors.surface },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    rowMe: { backgroundColor: theme.colors.accentSoft },
    rowRank: { width: 22, textAlign: "center", fontFamily: theme.typography.fontFamily.display, fontWeight: "800", fontSize: 15, color: theme.colors.textFaint },
    rowName: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 16, color: theme.colors.text },
    rowStreak: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textMuted },
    rowPts: { fontFamily: theme.typography.fontFamily.display, fontWeight: "800", fontSize: 17, color: theme.colors.text },
  });
}
