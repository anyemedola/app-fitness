import { useTheme } from "@app-fitness/theme";
import { AvatarStack, Button, Header, Input, SectionTitle, type ChallengeKind, type IconName } from "@app-fitness/ui";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import type { ChallengeCadence } from "../../domain/entities/Challenge";
import { useCreateChallenge } from "../hooks/useChallenges";
import { useActiveGroup, useMembers } from "../hooks/useGroups";
import { toDomainKind } from "../utils/challengeKind";

interface TypeDef {
  kind: ChallengeKind;
  icon: IconName;
  label: string;
  hint: string;
  unit: string;
  target: number;
  cadence: ChallengeCadence;
}

const TYPE_DEFS: readonly [TypeDef, ...TypeDef[]] = [
  { kind: "water", icon: "drop", label: "Meta diária", hint: "Acumular até um alvo (ex: 2L de água)", unit: "L", target: 2, cadence: "DAILY" },
  { kind: "photo", icon: "leaf", label: "Check com foto", hint: "Comprovar com foto (ex: comi salada)", unit: "", target: 1, cadence: "DAILY" },
  { kind: "count", icon: "dumbbell", label: "Contagem", hint: "Somar repetições (ex: 100 flexões)", unit: "reps", target: 100, cadence: "WEEKLY" },
  { kind: "streak", icon: "flame", label: "Sequência", hint: "Manter dias seguidos (ex: sem açúcar)", unit: "dias", target: 7, cadence: "STREAK" },
  { kind: "yesno", icon: "sun", label: "Sim / Não", hint: "Fez ou não fez hoje (ex: treino cedo)", unit: "", target: 1, cadence: "DAILY" },
];

export function CreateScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const { data: members } = useMembers(group?.memberIds ?? []);
  const createChallenge = useCreateChallenge();

  const [kind, setKind] = useState<ChallengeKind>(TYPE_DEFS[0].kind);
  const def = TYPE_DEFS.find((t) => t.kind === kind) ?? TYPE_DEFS[0];
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(def.target);
  const [requirePhoto, setRequirePhoto] = useState(false);

  const selectKind = (next: TypeDef) => {
    setKind(next.kind);
    setTarget(next.target);
    setRequirePhoto(next.kind === "photo");
  };

  const step = kind === "count" ? 10 : 1;

  const launch = async () => {
    if (!group) return;
    await createChallenge.mutateAsync({
      groupId: group.id,
      title: title.trim() || def.label,
      kind: toDomainKind(def.kind),
      cadence: def.cadence,
      unit: def.unit || undefined,
      target,
      requirePhoto,
    });
    router.push("/(tabs)/feed");
  };

  return (
    <View style={styles.container}>
      <Header title="Novo desafio" subtitle={group?.name ?? ""} back onBack={() => router.back()} />
      <View style={styles.content}>
        <View>
          <SectionTitle>Tipo de desafio</SectionTitle>
          <View style={styles.grid}>
            {TYPE_DEFS.map((t) => {
              const active = kind === t.kind;
              return (
                <Pressable
                  key={t.kind}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                  onPress={() => selectKind(t)}
                >
                  <Text style={styles.typeLabel}>{t.label}</Text>
                  <Text style={styles.typeHint}>{t.hint}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Input label="Nome do desafio" placeholder={`${def.label} do grupo`} value={title} onChangeText={setTitle} />

        {def.unit ? (
          <View>
            <Text style={styles.stepperLabel}>META ({def.unit})</Text>
            <View style={styles.stepperRow}>
              <Pressable style={styles.stepperButton} onPress={() => setTarget((v) => Math.max(1, v - step))}>
                <Text style={styles.stepperSymbol}>−</Text>
              </Pressable>
              <View style={styles.stepperValueBox}>
                <Text style={styles.stepperValue}>
                  {target} <Text style={styles.stepperUnit}>{def.unit}</Text>
                </Text>
              </View>
              <Pressable style={styles.stepperButton} onPress={() => setTarget((v) => v + step)}>
                <Text style={styles.stepperSymbol}>+</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Exigir foto de comprovação</Text>
            <Text style={styles.toggleHint}>Todos precisam enviar foto pra valer</Text>
          </View>
          <Switch value={requirePhoto} onValueChange={setRequirePhoto} disabled={kind === "photo"} />
        </View>

        <View style={styles.groupRow}>
          <Text style={styles.groupEmoji}>{group?.emoji ?? "🔥"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.groupEyebrow}>LANÇAR NO GRUPO</Text>
            <Text style={styles.groupName}>{group?.name ?? ""}</Text>
          </View>
          {members ? <AvatarStack users={members} size={24} max={3} /> : null}
        </View>

        <Button icon="flame" loading={createChallenge.isPending} onPress={launch}>
          Lançar desafio
        </Button>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.base, gap: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    typeCard: {
      width: "47%",
      padding: 13,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    typeCardActive: { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentSoft },
    typeLabel: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 16, color: theme.colors.text },
    typeHint: { marginTop: 2, fontFamily: theme.typography.fontFamily.body, fontSize: 11.5, lineHeight: 15, color: theme.colors.textMuted },
    stepperLabel: { fontFamily: theme.typography.fontFamily.mono, fontSize: 10, letterSpacing: 1, color: theme.colors.textFaint, marginBottom: 7 },
    stepperRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    stepperButton: {
      width: 52,
      height: 52,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    stepperSymbol: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 26, color: theme.colors.text },
    stepperValueBox: {
      flex: 1,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      paddingVertical: 12,
    },
    stepperValue: { fontFamily: theme.typography.fontFamily.displayExtraBold, fontSize: 24, color: theme.colors.text },
    stepperUnit: { fontSize: 14, fontWeight: "600", color: theme.colors.textMuted },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    toggleTitle: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 15, color: theme.colors.text },
    toggleHint: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textMuted },
    groupRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    groupEmoji: { fontSize: 22 },
    groupEyebrow: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textFaint },
    groupName: { fontFamily: theme.typography.fontFamily.display, fontWeight: "700", fontSize: 16, color: theme.colors.text },
  });
}
