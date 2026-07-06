import type { DailyStats } from "../entities/Stats";

export interface StatsRepository {
  getDaily(groupId?: string): Promise<DailyStats>;
}
