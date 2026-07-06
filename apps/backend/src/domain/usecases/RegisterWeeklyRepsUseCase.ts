import type { ProgressEntry } from "../entities";
import { isoWeekKey } from "../period";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { ProgressRepository } from "../repositories/ProgressRepository";

export interface RegisterWeeklyRepsInput {
  challengeId: string;
  userId: string;
  /** Reps to add this session, e.g. 10 or 30. */
  delta: number;
  now?: Date;
}

/** Adds reps to the current ISO week's tally on a `COUNT`-kind challenge (e.g. "100 flexões na semana"). */
export class RegisterWeeklyRepsUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly progress: ProgressRepository,
  ) {}

  async execute(input: RegisterWeeklyRepsInput): Promise<ProgressEntry> {
    const challenge = await this.challenges.findById(input.challengeId);
    if (!challenge) throw new Error(`Challenge ${input.challengeId} not found`);
    if (challenge.kind !== "COUNT") {
      throw new Error(`RegisterWeeklyRepsUseCase does not support challenges of kind ${challenge.kind}`);
    }
    if (input.delta < 0) throw new Error("delta must be a positive number of reps");

    const periodKey = isoWeekKey(input.now ?? new Date());
    const current = await this.progress.findEntry(challenge.id, input.userId, periodKey);
    const nextValue = (current?.value ?? 0) + input.delta;

    return this.progress.upsertEntry({
      challengeId: challenge.id,
      userId: input.userId,
      periodKey,
      value: nextValue,
    });
  }
}
