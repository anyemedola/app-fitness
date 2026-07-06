import { InMemoryChallengeRepository, InMemoryProgressRepository, makeChallenge } from "../../../__tests__/testUtils/inMemoryRepos";
import { AutoCheckUseCase } from "../AutoCheckUseCase";

describe("AutoCheckUseCase", () => {
  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }));
    const useCase = new AutoCheckUseCase(challenges, progress);
    return { useCase };
  }

  it("qualifies and marks done before the 8am UTC cutoff", async () => {
    const { useCase } = setup();
    const result = await useCase.execute({
      challengeId: "treino8h",
      userId: "teo",
      completedAt: new Date("2027-06-10T06:30:00.000Z"),
    });
    expect(result.qualified).toBe(true);
    expect(result.entry?.value).toBe(1);
  });

  it("does not qualify at or after the cutoff", async () => {
    const { useCase } = setup();
    const result = await useCase.execute({
      challengeId: "treino8h",
      userId: "teo",
      completedAt: new Date("2027-06-10T08:00:00.000Z"),
    });
    expect(result.qualified).toBe(false);
    expect(result.entry).toBeNull();
  });

  it("respects a custom cutoff hour", async () => {
    const { useCase } = setup();
    const result = await useCase.execute({
      challengeId: "treino8h",
      userId: "teo",
      completedAt: new Date("2027-06-10T09:30:00.000Z"),
      cutoffHour: 10,
    });
    expect(result.qualified).toBe(true);
  });
});
