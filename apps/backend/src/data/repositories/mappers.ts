import type { Challenge as PrismaChallenge, ProgressEntry as PrismaProgressEntry } from "@prisma/client";

import type { Challenge, ProgressEntry } from "../../domain/entities";

export function toChallengeEntity(row: PrismaChallenge): Challenge {
  return {
    id: row.id,
    groupId: row.groupId,
    ownerId: row.ownerId,
    title: row.title,
    description: row.description,
    kind: row.kind,
    cadence: row.cadence,
    unit: row.unit,
    target: row.target,
    requirePhoto: row.requirePhoto,
    createdAt: row.createdAt,
  };
}

export function toProgressEntryEntity(row: PrismaProgressEntry): ProgressEntry {
  return {
    id: row.id,
    challengeId: row.challengeId,
    userId: row.userId,
    periodKey: row.periodKey,
    value: row.value,
    photoUrl: row.photoUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
