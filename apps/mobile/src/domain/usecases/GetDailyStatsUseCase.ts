import type { DailyStats } from "../entities/Stats";
import type { StatsRepository } from "../repositories/StatsRepository";

export class GetDailyStatsUseCase {
  constructor(private readonly stats: StatsRepository) {}

  async execute(groupId?: string): Promise<DailyStats> {
    return this.stats.getDaily(groupId);
  }
}
