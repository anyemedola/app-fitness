import type { Challenge } from "../entities";

export interface ChallengeWithEntry {
  challenge: Challenge;
  /** The user's progress value for the current period, 0 if no entry exists yet. */
  value: number;
  periodKey: string;
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
}
