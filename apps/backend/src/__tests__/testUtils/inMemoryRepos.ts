import type { Challenge, ProgressEntry, StatsSnapshot } from "../../domain/entities";
import type { ChallengeRepository, ChallengeWithEntry } from "../../domain/repositories/ChallengeRepository";
import type { ProgressRepository, UpsertProgressInput } from "../../domain/repositories/ProgressRepository";
import type { StatsRepository } from "../../domain/repositories/StatsRepository";
import { periodKeyFor } from "../../domain/period";

/** In-memory doubles implementing the real repository interfaces — used to unit test use-cases
 * and controllers without a live Postgres, matching the exact contracts the Prisma repos fulfil. */

export class InMemoryChallengeRepository implements ChallengeRepository {
  private readonly byId = new Map<string, Challenge>();
  private readonly participants = new Map<string, Set<string>>(); // challengeId -> userIds

  constructor(private readonly progress?: InMemoryProgressRepository) {}

  seed(challenge: Challenge, participantIds: string[] = []): void {
    this.byId.set(challenge.id, challenge);
    this.participants.set(challenge.id, new Set(participantIds));
  }

  async findById(id: string): Promise<Challenge | null> {
    return this.byId.get(id) ?? null;
  }

  async findJoinedByUser(userId: string, groupId?: string, now = new Date()): Promise<ChallengeWithEntry[]> {
    const results: ChallengeWithEntry[] = [];
    for (const challenge of this.byId.values()) {
      if (groupId && challenge.groupId !== groupId) continue;
      if (!this.participants.get(challenge.id)?.has(userId)) continue;
      const periodKey = periodKeyFor(challenge.cadence, now);
      const value = (await this.progress?.findEntry(challenge.id, userId, periodKey))?.value ?? 0;
      results.push({ challenge, value, periodKey });
    }
    return results;
  }
}

export class InMemoryProgressRepository implements ProgressRepository {
  private readonly entries = new Map<string, ProgressEntry>();
  private seq = 0;

  private key(challengeId: string, userId: string, periodKey: string): string {
    return `${challengeId}::${userId}::${periodKey}`;
  }

  async findEntry(challengeId: string, userId: string, periodKey: string): Promise<ProgressEntry | null> {
    return this.entries.get(this.key(challengeId, userId, periodKey)) ?? null;
  }

  async upsertEntry(input: UpsertProgressInput): Promise<ProgressEntry> {
    const key = this.key(input.challengeId, input.userId, input.periodKey);
    const existing = this.entries.get(key);
    const now = new Date();
    const entry: ProgressEntry = {
      id: existing?.id ?? `progress-${(this.seq += 1)}`,
      challengeId: input.challengeId,
      userId: input.userId,
      periodKey: input.periodKey,
      value: input.value,
      photoUrl: input.photoUrl !== undefined ? input.photoUrl : (existing?.photoUrl ?? null),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.entries.set(key, entry);
    return entry;
  }
}

export class InMemoryStatsRepository implements StatsRepository {
  private readonly snapshots = new Map<string, StatsSnapshot>();

  private key(userId: string, date: string): string {
    return `${userId}::${date}`;
  }

  async upsertSnapshot(snapshot: StatsSnapshot): Promise<StatsSnapshot> {
    this.snapshots.set(this.key(snapshot.userId, snapshot.date), snapshot);
    return snapshot;
  }

  async findRecentBefore(userId: string, beforeDate: string, limit: number): Promise<StatsSnapshot[]> {
    return [...this.snapshots.values()]
      .filter((s) => s.userId === userId && s.date < beforeDate)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit);
  }
}

export function makeChallenge(overrides: Partial<Challenge> & Pick<Challenge, "id" | "kind">): Challenge {
  return {
    groupId: "group-1",
    ownerId: "owner-1",
    title: "Test challenge",
    description: null,
    cadence: overrides.kind === "COUNT" ? "WEEKLY" : overrides.kind === "STREAK" ? "STREAK" : "DAILY",
    unit: null,
    target: 1,
    requirePhoto: false,
    createdAt: new Date(),
    ...overrides,
  };
}
