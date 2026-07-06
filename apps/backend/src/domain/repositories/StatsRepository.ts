import type { StatsSnapshot } from "../entities";

export interface StatsRepository {
  upsertSnapshot(snapshot: StatsSnapshot): Promise<StatsSnapshot>;
  /** Snapshots strictly before `beforeDate` ("YYYY-MM-DD"), most recent first, for streak walk-back. */
  findRecentBefore(userId: string, beforeDate: string, limit: number): Promise<StatsSnapshot[]>;
}
