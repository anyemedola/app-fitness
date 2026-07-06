import { useTheme } from "@app-fitness/theme";
import { Button, Header, SectionTitle } from "@app-fitness/ui";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSignOut } from "../hooks/useAuthSession";

const OPTIONS: { key: "light" | "dark" | "system"; label: string }[] = [
  { key: "light", label: "Claro" },
  { key: "dark", label: "Escuro" },
  { key: "system", label: "Automático" },
];

export function SettingsScreen() {
  const { theme, preference, setPreference } = useTheme();
  const router = useRouter();
  const signOut = useSignOut();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Ajustes" back onBack={() => router.back()} />
      <View style={styles.content}>
        <View>
          <SectionTitle>Tema</SectionTitle>
          <View style={styles.optionGroup}>
            {OPTIONS.map((option) => {
              const active = preference === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => setPreference(option.key)}
                >
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button
          variant="secondary"
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/onboarding");
          }}
        >
          Sair da conta
        </Button>

        <Text style={styles.version}>Desafios Fitness em Grupo · v1.0.0</Text>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    content: { padding: theme.spacing.base, gap: theme.spacing.xl },
    optionGroup: { flexDirection: "row", gap: 10 },
    option: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    optionActive: { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentSoft },
    optionLabel: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 14, color: theme.colors.text },
    optionLabelActive: { color: theme.colors.accent, fontFamily: theme.typography.fontFamily.bodyBold },
    version: { textAlign: "center", fontFamily: theme.typography.fontFamily.mono, fontSize: 11, color: theme.colors.textFaint },
  });
}
