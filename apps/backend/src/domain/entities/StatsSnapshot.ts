export interface StatsSnapshot {
  userId: string;
  /** "YYYY-MM-DD" */
  date: string;
  completedChallenges: number;
  totalChallenges: number;
  completionPct: number;
  allCompleted: boolean;
}

export interface DailyStats {
  date: string;
  completedChallenges: number;
  totalChallenges: number;
  completionPct: number;
  /** Consecutive days (ending today, if completed) where the user hit `allCompleted`. */
  streakDays: number;
}
