import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  autoCheck,
  challengeRepository,
  createChallenge,
  incrementDailyProgress,
  markDailyCheck,
  registerWeeklyReps,
  uploadPhoto,
} from "../../infra/container";
import type { CreateChallengeInput } from "../../domain/repositories/ChallengeRepository";
import { useSessionStore } from "../stores/sessionStore";

const todayKey = (groupId?: string) => ["challenges", "today", groupId ?? "all"] as const;

export function useTodayChallenges(groupId?: string) {
  return useQuery({
    queryKey: todayKey(groupId),
    queryFn: () => challengeRepository.getToday(groupId),
  });
}

export function useChallenge(challengeId: string, groupId?: string) {
  const { data, ...rest } = useTodayChallenges(groupId);
  return { ...rest, data: data?.find((c) => c.id === challengeId) };
}

function useInvalidateChallenges() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["challenges"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };
}

export function useAddWaterProgress() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  return useMutation({
    mutationFn: (vars: { challengeId: string; delta: number }) =>
      incrementDailyProgress.execute(vars.challengeId, vars.delta),
    onSuccess: () => {
      invalidate();
      showToast("💧 +250 ml registrado");
    },
  });
}

export function useAddWeeklyReps() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  return useMutation({
    mutationFn: (vars: { challengeId: string; reps: number }) =>
      registerWeeklyReps.execute(vars.challengeId, vars.reps),
    onSuccess: () => {
      invalidate();
      showToast("💪 +10 reps");
    },
  });
}

export function useUploadChallengePhoto() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  const userId = useSessionStore((s) => s.user?.uid);
  return useMutation({
    mutationFn: (vars: { challengeId: string; localUri: string }) => {
      if (!userId) throw new Error("Você precisa estar logado para enviar uma foto.");
      return uploadPhoto.execute(userId, vars.challengeId, vars.localUri);
    },
    onSuccess: () => {
      invalidate();
      showToast("✅ Check-in publicado no feed!");
    },
  });
}

export function useMarkDailyCheck() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  return useMutation({
    mutationFn: (challengeId: string) => markDailyCheck.execute(challengeId),
    onSuccess: (result) => {
      invalidate();
      showToast(result.entry && result.entry.value > 0 ? "✅ Mandou bem!" : "Desmarcado");
    },
  });
}

export function useAutoCheck() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  return useMutation({
    mutationFn: (vars: { challengeId: string; completedAt?: Date }) =>
      autoCheck.execute(vars.challengeId, vars.completedAt),
    onSuccess: (result) => {
      invalidate();
      showToast(result.qualified ? "🌅 Treino antes das 8h confirmado!" : "Fora do horário — não contou dessa vez");
    },
  });
}

export function useCreateChallenge() {
  const invalidate = useInvalidateChallenges();
  const showToast = useSessionStore((s) => s.showToast);
  return useMutation({
    mutationFn: (input: CreateChallengeInput) => createChallenge.execute(input),
    onSuccess: () => {
      invalidate();
      showToast("🚀 Desafio lançado no grupo!");
    },
  });
}
