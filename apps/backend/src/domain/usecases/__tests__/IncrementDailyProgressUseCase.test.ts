import { InMemoryChallengeRepository, InMemoryProgressRepository, makeChallenge } from "../../../__tests__/testUtils/inMemoryRepos";
import { IncrementDailyProgressUseCase } from "../IncrementDailyProgressUseCase";

describe("IncrementDailyProgressUseCase", () => {
  const now = new Date("2027-06-10T10:00:00.000Z");

  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    const useCase = new IncrementDailyProgressUseCase(challenges, progress);
    return { challenges, progress, useCase };
  }

  it("adds the delta to today's value", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));

    const entry = await useCase.execute({ challengeId: "agua", userId: "lia", delta: 0.25, now });

    expect(entry.value).toBe(0.25);
    expect(entry.periodKey).toBe("2027-06-10");
  });

  it("accumulates across multiple calls", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));

    await useCase.execute({ challengeId: "agua", userId: "lia", delta: 0.25, now });
    await useCase.execute({ challengeId: "agua", userId: "lia", delta: 0.25, now });
    const entry = await useCase.execute({ challengeId: "agua", userId: "lia", delta: 0.25, now });

    expect(entry.value).toBe(0.75);
  });

  it("caps at the challenge target", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));

    await useCase.execute({ challengeId: "agua", userId: "lia", delta: 1.9, now });
    const entry = await useCase.execute({ challengeId: "agua", userId: "lia", delta: 1, now });

    expect(entry.value).toBe(2);
  });

  it("rejects non-WATER challenges", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }));

    await expect(useCase.execute({ challengeId: "flexoes", userId: "lia", delta: 1, now })).rejects.toThrow(
      /does not support/,
    );
  });

  it("rejects an unknown challenge", async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ challengeId: "missing", userId: "lia", delta: 1, now })).rejects.toThrow(
      /not found/,
    );
  });
});
