import { useTheme } from "@app-fitness/theme";
import { Icon, type IconName } from "@app-fitness/ui";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS: { name: string; icon: IconName; label: string }[] = [
  { name: "index", icon: "home", label: "Início" },
  { name: "feed", icon: "comment", label: "Feed" },
];
const TABS_AFTER_FAB: { name: string; icon: IconName; label: string }[] = [
  { name: "leaderboard", icon: "trophy", label: "Ranking" },
  { name: "profile", icon: "user", label: "Perfil" },
];

/** Custom 5-slot tab bar (Início / Feed / FAB / Ranking / Perfil) matching the design reference. */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme, insets.bottom), [theme, insets.bottom]);

  const renderTab = (tab: { name: string; icon: IconName; label: string }) => {
    const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
    const focused = routeIndex === state.index;
    const color = focused ? theme.colors.accent : theme.colors.textFaint;
    return (
      <Pressable
        key={tab.name}
        style={styles.tab}
        onPress={() => {
          const route = state.routes[routeIndex];
          if (!route) return;
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
      >
        <Icon name={tab.icon} size={23} color={color} strokeWidth={focused ? 2.5 : 2} />
        <Text style={[styles.label, { color, fontWeight: focused ? "700" : "600" }]}>{tab.label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      {TABS.map(renderTab)}
      <Pressable
        style={styles.fab}
        accessibilityLabel="Criar desafio"
        onPress={() => router.push("/create")}
      >
        <Icon name="plus" size={28} color={theme.colors.accentInk} strokeWidth={2.6} />
      </Pressable>
      {TABS_AFTER_FAB.map(renderTab)}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"], bottomInset: number) {
  return StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-around",
      paddingTop: 10,
      paddingBottom: Math.max(10, bottomInset),
      paddingHorizontal: 14,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    label: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: 10.5,
    },
    fab: {
      width: 56,
      height: 56,
      marginTop: -22,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      ...theme.shadows.md,
    },
  });
}
