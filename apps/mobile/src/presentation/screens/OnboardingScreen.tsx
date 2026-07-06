import { useTheme } from "@app-fitness/theme";
import { Button, Container, Icon, Spacer, type IconName } from "@app-fitness/ui";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES: { icon: IconName; title: string; description: string }[] = [
  { icon: "flame", title: "Desafios em grupo", description: "Água, flexões, salada, sequência sem açúcar e mais." },
  { icon: "comment", title: "Feed da galera", description: "Veja o progresso do grupo em tempo real e reaja." },
  { icon: "trophy", title: "Ranking semanal", description: "Suba no pódio e mantenha sua sequência de dias." },
];

export function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Container padded={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Icon name="flame" size={32} color={theme.colors.accentInk} filled strokeWidth={2} />
          </View>
          <Text style={styles.title}>Desafios Fitness{"\n"}em Grupo</Text>
          <Text style={styles.subtitle}>Bora chamar a galera e criar o hábito junto?</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Icon name={f.icon} size={20} color={theme.colors.accent} strokeWidth={2.2} />
              </View>
              <View style={styles.featureCopy}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDescription}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button onPress={() => router.push("/(auth)/login")}>Começar</Button>
          <Spacer size="sm" />
          <Text style={styles.footerNote}>Entre com Google ou Apple na próxima tela</Text>
        </View>
      </SafeAreaView>
    </Container>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.xl,
      justifyContent: "space-between",
    },
    hero: {
      marginTop: theme.spacing.xxxl,
      alignItems: "center",
    },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: 30,
      textAlign: "center",
      color: theme.colors.text,
      lineHeight: 36,
    },
    subtitle: {
      marginTop: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.lg,
      color: theme.colors.textMuted,
      textAlign: "center",
    },
    features: {
      gap: theme.spacing.lg,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.colors.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    featureCopy: {
      flex: 1,
    },
    featureTitle: {
      fontFamily: theme.typography.fontFamily.bodyBold,
      fontSize: theme.typography.size.md,
      color: theme.colors.text,
    },
    featureDescription: {
      marginTop: 2,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.base,
      color: theme.colors.textMuted,
    },
    footer: {
      marginBottom: theme.spacing.xl,
    },
    footerNote: {
      textAlign: "center",
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.sm,
      color: theme.colors.textFaint,
    },
  });
}
