import type { PrismaClient } from "@prisma/client";

import type { ProgressRepository, UpsertProgressInput } from "../../domain/repositories/ProgressRepository";

import { toProgressEntryEntity } from "./mappers";

export class PrismaProgressRepository implements ProgressRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findEntry(challengeId: string, userId: string, periodKey: string) {
    const row = await this.prisma.progressEntry.findUnique({
      where: { challengeId_userId_periodKey: { challengeId, userId, periodKey } },
    });
    return row ? toProgressEntryEntity(row) : null;
  }

  async upsertEntry(input: UpsertProgressInput) {
    const row = await this.prisma.progressEntry.upsert({
      where: {
        challengeId_userId_periodKey: {
          challengeId: input.challengeId,
          userId: input.userId,
          periodKey: input.periodKey,
        },
      },
      create: {
        challengeId: input.challengeId,
        userId: input.userId,
        periodKey: input.periodKey,
        value: input.value,
        photoUrl: input.photoUrl ?? null,
      },
      update: {
        value: input.value,
        ...(input.photoUrl !== undefined ? { photoUrl: input.photoUrl } : {}),
      },
    });
    return toProgressEntryEntity(row);
  }
}
