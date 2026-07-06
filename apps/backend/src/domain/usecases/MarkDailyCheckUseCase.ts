import type { ProgressEntry } from "../entities";
import { dayKey, previousDayKey } from "../period";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { ProgressRepository } from "../repositories/ProgressRepository";

export interface MarkDailyCheckInput {
  challengeId: string;
  userId: string;
  now?: Date;
}

/**
 * Marks today's check-in for a `YESNO` or `STREAK` challenge.
 * - `YESNO` (e.g. "Treino antes das 8h"): toggles between done/undone, mirroring the
 *   reference's "Marcar como feito" / "Concluído hoje — desfazer".
 * - `STREAK` (e.g. "Sem açúcar 7 dias"): continues yesterday's count by one, or restarts
 *   at 1 if yesterday was missed — "escorregou, zera".
 */
export class MarkDailyCheckUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly progress: ProgressRepository,
  ) {}

  async execute(input: MarkDailyCheckInput): Promise<ProgressEntry> {
    const challenge = await this.challenges.findById(input.challengeId);
    if (!challenge) throw new Error(`Challenge ${input.challengeId} not found`);
    if (challenge.kind !== "YESNO" && challenge.kind !== "STREAK") {
      throw new Error(`MarkDailyCheckUseCase does not support challenges of kind ${challenge.kind}`);
    }

    const now = input.now ?? new Date();
    const today = dayKey(now);
    const todayEntry = await this.progress.findEntry(challenge.id, input.userId, today);

    if (challenge.kind === "YESNO") {
      const done = (todayEntry?.value ?? 0) >= challenge.target;
      return this.progress.upsertEntry({
        challengeId: challenge.id,
        userId: input.userId,
        periodKey: today,
        value: done ? 0 : challenge.target,
      });
    }

    // STREAK
    const yesterdayEntry = await this.progress.findEntry(challenge.id, input.userId, previousDayKey(today));
    const continuingStreak = (yesterdayEntry?.value ?? 0) >= 1;
    const nextValue = Math.min(challenge.target, continuingStreak ? (yesterdayEntry?.value ?? 0) + 1 : 1);

    return this.progress.upsertEntry({
      challengeId: challenge.id,
      userId: input.userId,
      periodKey: today,
      value: nextValue,
    });
  }
}
