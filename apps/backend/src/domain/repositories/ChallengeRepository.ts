import type { Challenge, ChallengeCadence, ChallengeKind } from "../entities";

export interface ChallengeWithEntry {
  challenge: Challenge;
  /** The user's progress value for the current period, 0 if no entry exists yet. */
  value: number;
  periodKey: string;
}

export interface CreateChallengeInput {
  groupId: string;
  ownerId: string;
  title: string;
  description?: string | null;
  kind: ChallengeKind;
  cadence: ChallengeCadence;
  unit?: string | null;
  target: number;
  requirePhoto?: boolean;
}

export interface ChallengeRepository {
  findById(id: string): Promise<Challenge | null>;
  /**
   * Challenges the user has joined, each paired with their current-period progress.
   * `now` determines which period ("today", "this ISO week", ...) counts as current —
   * callers should always pass it explicitly so it stays in sync with their own date
   * logic (e.g. `GetDailyStatsUseCase`'s `today`) instead of silently drifting from it.
   */
  findJoinedByUser(userId: string, groupId?: string, now?: Date): Promise<ChallengeWithEntry[]>;
  /** Creates a challenge and immediately enrolls its owner as the first participant. */
  create(input: CreateChallengeInput): Promise<Challenge>;
}
