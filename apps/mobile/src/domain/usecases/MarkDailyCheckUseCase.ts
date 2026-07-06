import type { CheckResult, ChallengeRepository } from "../repositories/ChallengeRepository";

/** Manual check-in for `YESNO`/`STREAK` challenges (e.g. tapping "Marcar como feito"). */
export class MarkDailyCheckUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  async execute(challengeId: string): Promise<CheckResult> {
    return this.challenges.check(challengeId);
  }
}
