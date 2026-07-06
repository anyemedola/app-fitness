import type { Challenge, ProgressResult } from "../../domain/entities/Challenge";
import type { ChallengeRepository, CheckResult, CreateChallengeInput } from "../../domain/repositories/ChallengeRepository";
import type { ApiClient } from "../../infra/http/apiClient";

export class HttpChallengeRepository implements ChallengeRepository {
  constructor(private readonly api: ApiClient) {}

  async getToday(groupId?: string): Promise<Challenge[]> {
    const query = groupId ? `?groupId=${encodeURIComponent(groupId)}` : "";
    const { challenges } = await this.api.get<{ challenges: Challenge[] }>(`/challenges/today${query}`);
    return challenges;
  }

  async addProgress(challengeId: string, delta: number): Promise<ProgressResult> {
    const { entry } = await this.api.post<{ entry: ProgressResult }>(`/challenges/${challengeId}/progress`, {
      delta,
    });
    return entry;
  }

  async uploadPhoto(challengeId: string, photoUrl: string): Promise<ProgressResult> {
    const { entry } = await this.api.post<{ entry: ProgressResult }>(`/challenges/${challengeId}/photo`, {
      photoUrl,
    });
    return entry;
  }

  async check(challengeId: string, completedAt?: Date): Promise<CheckResult> {
    if (completedAt) {
      return this.api.post<CheckResult>(`/challenges/${challengeId}/check`, {
        completedAt: completedAt.toISOString(),
      });
    }
    const { entry } = await this.api.post<{ entry: ProgressResult }>(`/challenges/${challengeId}/check`, {});
    return { entry };
  }

  async create(input: CreateChallengeInput): Promise<Challenge> {
    const { challenge } = await this.api.post<{ challenge: Challenge }>("/challenges", input);
    return challenge;
  }
}
