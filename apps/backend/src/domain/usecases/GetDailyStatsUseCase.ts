import type { DailyStats } from "../entities";
import { dayKey, previousDayKey } from "../period";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { StatsRepository } from "../repositories/StatsRepository";

export interface GetDailyStatsInput {
  userId: string;
  groupId?: string;
  now?: Date;
}

/**
 * Computes today's completion for the user's joined challenges, persists it as a
 * `StatsSnapshot`, and derives the "days in a row" streak by walking back through
 * previous snapshots — mirrors the dashboard's "58% hoje" / "12 dias seguidos" figures.
 */
export class GetDailyStatsUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly stats: StatsRepository,
  ) {}

  async execute(input: GetDailyStatsInput): Promise<DailyStats> {
    const now = input.now ?? new Date();
    const joined = await this.challenges.findJoinedByUser(input.userId, input.groupId, now);
    const today = dayKey(now);

    const totalChallenges = joined.length;
    const ratios = joined.map((j) => Math.min(1, j.challenge.target > 0 ? j.value / j.challenge.target : 0));
    const completionPct = totalChallenges > 0 ? ratios.reduce((a, b) => a + b, 0) / totalChallenges : 0;

    // Streak-kind challenges don't count toward the whole-number "completed" tally —
    // they're tracked by their own running count, not a same-day pass/fail.
    const countable = joined.filter((j) => j.challenge.kind !== "STREAK");
    const completedChallenges = countable.filter(
      (j) => j.challenge.target > 0 && j.value >= j.challenge.target,
    ).length;
    const allCompleted = countable.length > 0 && completedChallenges === countable.length;

    await this.stats.upsertSnapshot({
      userId: input.userId,
      date: today,
      completedChallenges,
      totalChallenges,
      completionPct,
      allCompleted,
    });

    const streakDays = await this.computeStreak(input.userId, today, allCompleted);

    return { date: today, completedChallenges, totalChallenges, completionPct, streakDays };
  }

  private async computeStreak(userId: string, today: string, todayCompleted: boolean): Promise<number> {
    if (!todayCompleted) return 0;

    let streak = 1;
    let cursor = today;
    // Bounded lookback keeps this cheap; a year comfortably covers realistic streaks.
    const history = await this.stats.findRecentBefore(userId, today, 365);
    const byDate = new Map(history.map((s) => [s.date, s]));

    for (let i = 0; i < 365; i += 1) {
      cursor = previousDayKey(cursor);
      const snapshot = byDate.get(cursor);
      if (!snapshot?.allCompleted) break;
      streak += 1;
    }
    return streak;
  }
}
