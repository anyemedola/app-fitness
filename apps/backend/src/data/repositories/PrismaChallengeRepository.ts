import type { PrismaClient } from "@prisma/client";

import type {
  ChallengeRepository,
  ChallengeWithEntry,
  CreateChallengeInput,
} from "../../domain/repositories/ChallengeRepository";
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

  async create(input: CreateChallengeInput) {
    const row = await this.prisma.challenge.create({
      data: {
        groupId: input.groupId,
        ownerId: input.ownerId,
        title: input.title,
        description: input.description ?? null,
        kind: input.kind,
        cadence: input.cadence,
        unit: input.unit ?? null,
        target: input.target,
        requirePhoto: input.requirePhoto ?? false,
        participants: { create: { userId: input.ownerId } },
      },
    });
    return toChallengeEntity(row);
  }
}
