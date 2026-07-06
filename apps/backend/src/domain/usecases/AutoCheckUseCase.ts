import type { ProgressEntry } from "../entities";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { ProgressRepository } from "../repositories/ProgressRepository";

import { MarkDailyCheckUseCase } from "./MarkDailyCheckUseCase";

export interface AutoCheckInput {
  challengeId: string;
  userId: string;
  /** When the qualifying activity happened, e.g. when the workout was logged. */
  completedAt: Date;
  /** UTC hour (0-23) before which the activity must happen to count. Defaults to 8. */
  cutoffHour?: number;
}

export interface AutoCheckResult {
  qualified: boolean;
  entry: ProgressEntry | null;
}

/**
 * Server-side rule for "Treino antes das 8h": only marks the `YESNO` challenge done when
 * the activity's timestamp is before the cutoff hour (08:00 UTC by default). Compared in
 * UTC (rather than the server process's local time) so the result doesn't depend on which
 * machine/timezone the backend happens to run in; per-user local-timezone cutoffs would
 * need the user's UTC offset, which isn't modeled yet.
 */
export class AutoCheckUseCase {
  private readonly markDailyCheck: MarkDailyCheckUseCase;

  constructor(challenges: ChallengeRepository, progress: ProgressRepository) {
    this.markDailyCheck = new MarkDailyCheckUseCase(challenges, progress);
  }

  async execute(input: AutoCheckInput): Promise<AutoCheckResult> {
    const cutoffHour = input.cutoffHour ?? 8;
    const qualifies = input.completedAt.getUTCHours() < cutoffHour;
    if (!qualifies) {
      return { qualified: false, entry: null };
    }
    const entry = await this.markDailyCheck.execute({
      challengeId: input.challengeId,
      userId: input.userId,
      now: input.completedAt,
    });
    return { qualified: true, entry };
  }
}
