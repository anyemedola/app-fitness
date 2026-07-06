import type { PrismaClient } from "@prisma/client";

import type { ChallengeRepository, ChallengeWithEntry } from "../../domain/repositories/ChallengeRepository";
import { periodKeyFor } from "../../domain/period";

import { toChallengeEntity } from "./mappers";

export class PrismaChallengeRepository implements ChallengeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    const row = await this.prisma.challenge.findUnique({ where: { id } });
    return row ? toChallengeEntity(row) : null;
  }

  async findJoinedByUser(userId: string, groupId?: string, now = new Date()): Promise<ChallengeWithEntry[]> {
    const participations = await this.prisma.challengeParticipant.findMany({
      where: { userId, challenge: groupId ? { groupId } : undefined },
      include: { challenge: true },
    });

    return Promise.all(
      participations.map(async (participation) => {
        const challenge = toChallengeEntity(participation.challenge);
        const periodKey = periodKeyFor(challenge.cadence, now);
        const entry = await this.prisma.progressEntry.findUnique({
          where: { challengeId_userId_periodKey: { challengeId: challenge.id, userId, periodKey } },
        });
        return { challenge, value: entry?.value ?? 0, periodKey };
      }),
    );
  }
}
