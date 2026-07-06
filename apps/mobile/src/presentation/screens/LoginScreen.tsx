import { useTheme } from "@app-fitness/theme";
import { Button, Container, Icon, Spacer } from "@app-fitness/ui";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSignInWithApple, useSignInWithGoogle } from "../hooks/useAuthSession";

export function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const signInWithGoogle = useSignInWithGoogle();
  const signInWithApple = useSignInWithApple();
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    setLoading("google");
    try {
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch {
      setError("Não deu pra entrar com Google agora. Tenta de novo.");
    } finally {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    setError(null);
    setLoading("apple");
    try {
      await signInWithApple();
      router.replace("/(tabs)");
    } catch {
      setError("Não deu pra entrar com Apple agora. Tenta de novo.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container padded={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Icon name="flame" size={28} color={theme.colors.accentInk} filled strokeWidth={2} />
          </View>
          <Text style={styles.title}>Bora treinar junto?</Text>
          <Text style={styles.subtitle}>Entre para ver os desafios do seu grupo</Text>
        </View>

        <View style={styles.actions}>
          <Button
            variant="secondary"
            icon="user"
            loading={loading === "google"}
            disabled={loading !== null}
            onPress={handleGoogle}
          >
            Continuar com Google
          </Button>
          <Spacer size="md" />
          {Platform.OS === "ios" && (
            <Button
              variant="secondary"
              icon="user"
              loading={loading === "apple"}
              disabled={loading !== null}
              onPress={handleApple}
            >
              Continuar com Apple
            </Button>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <Text style={styles.terms}>Ao continuar, você concorda com nossos Termos e Política de Privacidade.</Text>
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
      paddingBottom: theme.spacing.xl,
    },
    header: {
      marginTop: theme.spacing.xxxl,
      alignItems: "center",
    },
    badge: {
      width: 60,
      height: 60,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: theme.typography.size.displayLg,
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: 6,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.lg,
      color: theme.colors.textMuted,
      textAlign: "center",
    },
    actions: {
      gap: theme.spacing.sm,
    },
    error: {
      marginTop: theme.spacing.sm,
      textAlign: "center",
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.base,
      color: theme.colors.danger,
    },
    terms: {
      textAlign: "center",
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.sm,
      color: theme.colors.textFaint,
    },
  });
}
