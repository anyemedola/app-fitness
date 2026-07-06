import type { PrismaClient } from "@prisma/client";

import type { StatsSnapshot } from "../../domain/entities";
import type { StatsRepository } from "../../domain/repositories/StatsRepository";

export class PrismaStatsRepository implements StatsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsertSnapshot(snapshot: StatsSnapshot): Promise<StatsSnapshot> {
    const row = await this.prisma.statsSnapshot.upsert({
      where: { userId_date: { userId: snapshot.userId, date: snapshot.date } },
      create: { ...snapshot },
      update: {
        completedChallenges: snapshot.completedChallenges,
        totalChallenges: snapshot.totalChallenges,
        completionPct: snapshot.completionPct,
        allCompleted: snapshot.allCompleted,
      },
    });
    return {
      userId: row.userId,
      date: row.date,
      completedChallenges: row.completedChallenges,
      totalChallenges: row.totalChallenges,
      completionPct: row.completionPct,
      allCompleted: row.allCompleted,
    };
  }

  async findRecentBefore(userId: string, beforeDate: string, limit: number): Promise<StatsSnapshot[]> {
    const rows = await this.prisma.statsSnapshot.findMany({
      where: { userId, date: { lt: beforeDate } },
      orderBy: { date: "desc" },
      take: limit,
    });
    return rows.map((row) => ({
      userId: row.userId,
      date: row.date,
      completedChallenges: row.completedChallenges,
      totalChallenges: row.totalChallenges,
      completionPct: row.completionPct,
      allCompleted: row.allCompleted,
    }));
  }
}
