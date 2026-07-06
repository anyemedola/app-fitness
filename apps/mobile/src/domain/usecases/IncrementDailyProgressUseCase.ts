import type { ProgressResult } from "../entities/Challenge";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";

export class IncrementDailyProgressUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  /** e.g. tapping "+250 ml" on the water challenge. */
  async execute(challengeId: string, delta: number): Promise<ProgressResult> {
    if (delta <= 0) throw new Error("delta must be a positive number");
    return this.challenges.addProgress(challengeId, delta);
  }
}
