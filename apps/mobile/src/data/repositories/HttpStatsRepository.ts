import type { DailyStats } from "../../domain/entities/Stats";
import type { StatsRepository } from "../../domain/repositories/StatsRepository";
import type { ApiClient } from "../../infra/http/apiClient";

export class HttpStatsRepository implements StatsRepository {
  constructor(private readonly api: ApiClient) {}

  async getDaily(groupId?: string): Promise<DailyStats> {
    const query = groupId ? `?groupId=${encodeURIComponent(groupId)}` : "";
    return this.api.get<DailyStats>(`/stats${query}`);
  }
}
