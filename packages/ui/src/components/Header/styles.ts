import { StyleSheet } from "react-native";
import type { Theme } from "@app-fitness/theme";

export function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      paddingTop: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.base,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      minHeight: 40,
    },
    iconButton: {
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
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    titleColumn: {
      flex: 1,
      minWidth: 0,
    },
    subtitle: {
      fontFamily: theme.typography.fontFamily.mono,
      fontSize: theme.typography.size.sm,
      letterSpacing: theme.typography.letterSpacing.trackedWide,
      color: theme.colors.textFaint,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    title: {
      fontFamily: theme.typography.fontFamily.displayExtraBold,
      fontSize: theme.typography.size.displayLg,
      letterSpacing: theme.typography.letterSpacing.tight,
      color: theme.colors.text,
    },
    titleSmall: {
      fontSize: theme.typography.size.display - 2,
    },
  });
}
