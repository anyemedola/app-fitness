import type { IconName } from "@app-fitness/ui";
import { clampRatio, formatProgress } from "@app-fitness/utils";
import { useRouter } from "expo-router";

import type { Challenge } from "../../domain/entities";

import { useAddWaterProgress, useMarkDailyCheck } from "./useChallenges";

export interface QuickAction {
  progress: number;
  label: string;
  action: { label: string; icon?: IconName; done: boolean; onPress: () => void };
}

/**
 * Per-kind dashboard row behavior — mirrors the design reference's `useQuickAction`:
 * `water` gets a one-tap "+250 ml", `photo`/`count` route to their detail screen, and
 * `streak`/`yesno` toggle a check directly from the list.
 */
export function useQuickAction(challenge: Challenge): QuickAction {
  const router = useRouter();
  const addWater = useAddWaterProgress();
  const markCheck = useMarkDailyCheck();
  const progress = clampRatio(challenge.value / challenge.target);

  if (challenge.kind === "WATER") {
    return {
      progress,
      label: formatProgress(challenge.value, challenge.target, challenge.unit ?? undefined),
      action: {
        label: "+250 ml",
        done: challenge.value >= challenge.target,
        onPress: () => addWater.mutate({ challengeId: challenge.id, delta: 0.25 }),
      },
    };
  }

  if (challenge.kind === "COUNT") {
    return {
      progress,
      label: formatProgress(challenge.value, challenge.target, challenge.unit ?? "reps"),
      action: {
        label: "Registrar",
        done: false,
        onPress: () => router.push(`/challenge/${challenge.id}`),
      },
    };
  }

  if (challenge.kind === "PHOTO") {
    const done = challenge.value >= challenge.target;
    return {
      progress: done ? 1 : 0,
      label: done ? "Feito hoje" : "Falta o check",
      action: {
        label: "Enviar foto",
        icon: "camera",
        done,
        onPress: () => router.push(`/challenge/${challenge.id}/upload`),
      },
    };
  }

  if (challenge.kind === "STREAK") {
    return {
      progress,
      label: `Dia ${challenge.value} de ${challenge.target}`,
      action: {
        label: "Check",
        icon: "check",
        done: false,
        onPress: () => markCheck.mutate(challenge.id),
      },
    };
  }

  // YESNO
  const done = challenge.value >= challenge.target;
  return {
    progress: done ? 1 : 0,
    label: done ? "Feito hoje" : "Ainda não",
    action: {
      label: done ? "Feito" : "Marcar",
      icon: "check",
      done,
      onPress: () => markCheck.mutate(challenge.id),
    },
  };
}
