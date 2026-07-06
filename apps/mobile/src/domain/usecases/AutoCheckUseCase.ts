import type { CheckResult, ChallengeRepository } from "../repositories/ChallengeRepository";

/**
 * Reports the moment a qualifying activity happened (e.g. a workout logged by a health
 * integration) so the backend can decide whether it counts as "Treino antes das 8h" —
 * the cutoff rule itself lives server-side (`AutoCheckUseCase` in `apps/backend`).
 */
export class AutoCheckUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  async execute(challengeId: string, completedAt: Date = new Date()): Promise<CheckResult> {
    return this.challenges.check(challengeId, completedAt);
  }
}
