import type { ProgressEntry } from "../entities";
import { dayKey } from "../period";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { ProgressRepository } from "../repositories/ProgressRepository";

export interface IncrementDailyProgressInput {
  challengeId: string;
  userId: string;
  /** Amount to add, e.g. 0.25 for "+250 ml" on a 2L water challenge. */
  delta: number;
  now?: Date;
}

/** Increments today's progress on a `WATER`-kind (or any daily numeric) challenge, capped at its target. */
export class IncrementDailyProgressUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly progress: ProgressRepository,
  ) {}

  async execute(input: IncrementDailyProgressInput): Promise<ProgressEntry> {
    const challenge = await this.challenges.findById(input.challengeId);
    if (!challenge) throw new Error(`Challenge ${input.challengeId} not found`);
    if (challenge.kind !== "WATER") {
      throw new Error(`IncrementDailyProgressUseCase does not support challenges of kind ${challenge.kind}`);
    }

    const periodKey = dayKey(input.now ?? new Date());
    const current = await this.progress.findEntry(challenge.id, input.userId, periodKey);
    const nextValue = Math.min(challenge.target, Math.round(((current?.value ?? 0) + input.delta) * 100) / 100);

    return this.progress.upsertEntry({
      challengeId: challenge.id,
      userId: input.userId,
      periodKey,
      value: Math.max(0, nextValue),
    });
  }
}
