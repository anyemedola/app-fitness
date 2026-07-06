import type { Challenge, ProgressResult } from "../../domain/entities/Challenge";
import type { DailyStats } from "../../domain/entities/Stats";
import type { ChallengeRepository, CheckResult, CreateChallengeInput } from "../../domain/repositories/ChallengeRepository";
import type { PhotoStorageRepository } from "../../domain/repositories/PhotoStorageRepository";
import type { StatsRepository } from "../../domain/repositories/StatsRepository";

/** In-memory doubles implementing the mobile domain's repository interfaces, for use-case unit tests. */

export class FakeChallengeRepository implements ChallengeRepository {
  private challenges: Challenge[] = [];
  public lastProgressCall: { challengeId: string; delta: number } | null = null;
  public lastPhotoCall: { challengeId: string; photoUrl: string } | null = null;
  public lastCheckCall: { challengeId: string; completedAt?: Date } | null = null;
  public checkResult: CheckResult = { entry: { value: 1, periodKey: "2027-06-10" } };

  seed(challenges: Challenge[]): void {
    this.challenges = challenges;
  }

  async getToday(): Promise<Challenge[]> {
    return this.challenges;
  }

  async addProgress(challengeId: string, delta: number): Promise<ProgressResult> {
    this.lastProgressCall = { challengeId, delta };
    return { value: delta, periodKey: "2027-06-10" };
  }

  async uploadPhoto(challengeId: string, photoUrl: string): Promise<ProgressResult> {
    this.lastPhotoCall = { challengeId, photoUrl };
    return { value: 1, periodKey: "2027-06-10", photoUrl };
  }

  async check(challengeId: string, completedAt?: Date): Promise<CheckResult> {
    this.lastCheckCall = { challengeId, completedAt };
    return this.checkResult;
  }

  async create(input: CreateChallengeInput): Promise<Challenge> {
    const challenge: Challenge = {
      id: "new-challenge",
      groupId: input.groupId,
      title: input.title,
      description: input.description ?? null,
      kind: input.kind,
      cadence: input.cadence,
      unit: input.unit ?? null,
      target: input.target,
      requirePhoto: input.requirePhoto ?? false,
      value: 0,
      periodKey: "2027-06-10",
    };
    this.challenges = [...this.challenges, challenge];
    return challenge;
  }
}

export class FakeStatsRepository implements StatsRepository {
  public stats: DailyStats = {
    date: "2027-06-10",
    completedChallenges: 1,
    totalChallenges: 3,
    completionPct: 0.58,
    streakDays: 12,
  };

  async getDaily(): Promise<DailyStats> {
    return this.stats;
  }
}

export class FakePhotoStorageRepository implements PhotoStorageRepository {
  public lastUpload: { userId: string; challengeId: string; localUri: string } | null = null;
  public urlToReturn = "https://storage.example/photo.jpg";

  async upload(userId: string, challengeId: string, localUri: string): Promise<string> {
    this.lastUpload = { userId, challengeId, localUri };
    return this.urlToReturn;
  }
}

export function makeChallenge(overrides: Partial<Challenge> & Pick<Challenge, "id" | "kind">): Challenge {
  return {
    groupId: "suor",
    title: "Test challenge",
    description: null,
    cadence: "DAILY",
    unit: null,
    target: 1,
    requirePhoto: false,
    value: 0,
    periodKey: "2027-06-10",
    ...overrides,
  };
}
