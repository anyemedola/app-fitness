import { InMemoryChallengeRepository, InMemoryProgressRepository, makeChallenge } from "../../../__tests__/testUtils/inMemoryRepos";
import { RegisterWeeklyRepsUseCase } from "../RegisterWeeklyRepsUseCase";

describe("RegisterWeeklyRepsUseCase", () => {
  const thursday = new Date("2027-06-10T10:00:00.000Z");

  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    const useCase = new RegisterWeeklyRepsUseCase(challenges, progress);
    return { challenges, progress, useCase };
  }

  it("sums reps within the same ISO week", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }));

    await useCase.execute({ challengeId: "flexoes", userId: "bruno", delta: 30, now: thursday });
    const entry = await useCase.execute({ challengeId: "flexoes", userId: "bruno", delta: 34, now: thursday });

    expect(entry.value).toBe(64);
  });

  it("does not cap at the target — exceeding it is allowed", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }));

    const entry = await useCase.execute({ challengeId: "flexoes", userId: "bruno", delta: 150, now: thursday });
    expect(entry.value).toBe(150);
  });

  it("starts a fresh tally in a new ISO week", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }));

    await useCase.execute({ challengeId: "flexoes", userId: "bruno", delta: 60, now: new Date("2027-06-10T10:00:00.000Z") });
    const nextWeek = await useCase.execute({
      challengeId: "flexoes",
      userId: "bruno",
      delta: 10,
      now: new Date("2027-06-17T10:00:00.000Z"),
    });

    expect(nextWeek.value).toBe(10);
  });

  it("rejects a negative delta", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }));
    await expect(
      useCase.execute({ challengeId: "flexoes", userId: "bruno", delta: -5, now: thursday }),
    ).rejects.toThrow(/positive/);
  });

  it("rejects non-COUNT challenges", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));
    await expect(
      useCase.execute({ challengeId: "agua", userId: "bruno", delta: 5, now: thursday }),
    ).rejects.toThrow(/does not support/);
  });
});
