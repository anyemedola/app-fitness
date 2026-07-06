import type { ProgressResult } from "../entities/Challenge";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";

export class RegisterWeeklyRepsUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  /** e.g. logging a set of "+10 reps" toward the weekly push-up count. */
  async execute(challengeId: string, reps: number): Promise<ProgressResult> {
    if (reps <= 0) throw new Error("reps must be a positive number");
    return this.challenges.addProgress(challengeId, reps);
  }
}
