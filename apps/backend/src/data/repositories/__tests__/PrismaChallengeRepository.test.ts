import type { PrismaClient } from "@prisma/client";

import { PrismaChallengeRepository } from "../PrismaChallengeRepository";

function fakePrismaRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "agua",
    groupId: "suor",
    ownerId: "marina",
    title: "2L de água por dia",
    description: "Hidratação é base de tudo.",
    kind: "WATER",
    cadence: "DAILY",
    unit: "L",
    target: 2,
    requirePhoto: false,
    createdAt: new Date("2027-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function fakePrisma() {
  return {
    challenge: { findUnique: jest.fn() },
    challengeParticipant: { findMany: jest.fn() },
    progressEntry: { findUnique: jest.fn() },
  } as unknown as PrismaClient & {
    challenge: { findUnique: jest.Mock };
    challengeParticipant: { findMany: jest.Mock };
    progressEntry: { findUnique: jest.Mock };
  };
}

describe("PrismaChallengeRepository.findById", () => {
  it("maps a found row into a Challenge entity", async () => {
    const prisma = fakePrisma();
    prisma.challenge.findUnique.mockResolvedValue(fakePrismaRow());
    const repo = new PrismaChallengeRepository(prisma);

    const result = await repo.findById("agua");

    expect(prisma.challenge.findUnique).toHaveBeenCalledWith({ where: { id: "agua" } });
    expect(result).toMatchObject({ id: "agua", kind: "WATER", target: 2, unit: "L" });
  });

  it("returns null when not found", async () => {
    const prisma = fakePrisma();
    prisma.challenge.findUnique.mockResolvedValue(null);
    const repo = new PrismaChallengeRepository(prisma);
    expect(await repo.findById("missing")).toBeNull();
  });
});

describe("PrismaChallengeRepository.findJoinedByUser", () => {
  it("pairs each joined challenge with its current-period progress value", async () => {
    const prisma = fakePrisma();
    prisma.challengeParticipant.findMany.mockResolvedValue([{ challenge: fakePrismaRow() }]);
    prisma.progressEntry.findUnique.mockResolvedValue({
      id: "p1",
      challengeId: "agua",
      userId: "lia",
      periodKey: "2027-06-10",
      value: 1.4,
      photoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const repo = new PrismaChallengeRepository(prisma);

    const results = await repo.findJoinedByUser("lia", "suor");

    expect(prisma.challengeParticipant.findMany).toHaveBeenCalledWith({
      where: { userId: "lia", challenge: { groupId: "suor" } },
      include: { challenge: true },
    });
    expect(results).toHaveLength(1);
    expect(results[0]?.value).toBe(1.4);
    expect(results[0]?.challenge.id).toBe("agua");
  });

  it("defaults the value to 0 when no progress entry exists yet", async () => {
    const prisma = fakePrisma();
    prisma.challengeParticipant.findMany.mockResolvedValue([{ challenge: fakePrismaRow() }]);
    prisma.progressEntry.findUnique.mockResolvedValue(null);
    const repo = new PrismaChallengeRepository(prisma);

    const [result] = await repo.findJoinedByUser("lia");
    expect(result?.value).toBe(0);
  });
});
