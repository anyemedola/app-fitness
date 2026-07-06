import type { PrismaClient } from "@prisma/client";

import { PrismaProgressRepository } from "../PrismaProgressRepository";

function fakePrisma() {
  return {
    progressEntry: { findUnique: jest.fn(), upsert: jest.fn() },
  } as unknown as PrismaClient & {
    progressEntry: { findUnique: jest.Mock; upsert: jest.Mock };
  };
}

const row = {
  id: "p1",
  challengeId: "agua",
  userId: "lia",
  periodKey: "2027-06-10",
  value: 1.4,
  photoUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("PrismaProgressRepository.findEntry", () => {
  it("queries by the composite unique key and maps the row", async () => {
    const prisma = fakePrisma();
    prisma.progressEntry.findUnique.mockResolvedValue(row);
    const repo = new PrismaProgressRepository(prisma);

    const result = await repo.findEntry("agua", "lia", "2027-06-10");

    expect(prisma.progressEntry.findUnique).toHaveBeenCalledWith({
      where: { challengeId_userId_periodKey: { challengeId: "agua", userId: "lia", periodKey: "2027-06-10" } },
    });
    expect(result?.value).toBe(1.4);
  });
});

describe("PrismaProgressRepository.upsertEntry", () => {
  it("creates with the given photoUrl and updates value/photoUrl on conflict", async () => {
    const prisma = fakePrisma();
    prisma.progressEntry.upsert.mockResolvedValue({ ...row, photoUrl: "https://x/y.jpg", value: 1 });
    const repo = new PrismaProgressRepository(prisma);

    const result = await repo.upsertEntry({
      challengeId: "salada",
      userId: "lia",
      periodKey: "2027-06-10",
      value: 1,
      photoUrl: "https://x/y.jpg",
    });

    expect(prisma.progressEntry.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ photoUrl: "https://x/y.jpg", value: 1 }),
        update: expect.objectContaining({ photoUrl: "https://x/y.jpg", value: 1 }),
      }),
    );
    expect(result.photoUrl).toBe("https://x/y.jpg");
  });

  it("omits photoUrl from the update payload when not provided", async () => {
    const prisma = fakePrisma();
    prisma.progressEntry.upsert.mockResolvedValue(row);
    const repo = new PrismaProgressRepository(prisma);

    await repo.upsertEntry({ challengeId: "agua", userId: "lia", periodKey: "2027-06-10", value: 1.5 });

    const call = prisma.progressEntry.upsert.mock.calls[0][0];
    expect(call.update).not.toHaveProperty("photoUrl");
    expect(call.create.photoUrl).toBeNull();
  });
});
