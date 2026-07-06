import { FakeChallengeRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { IncrementDailyProgressUseCase } from "../IncrementDailyProgressUseCase";

describe("IncrementDailyProgressUseCase", () => {
  it("delegates to the repository with the given delta", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new IncrementDailyProgressUseCase(challenges);

    await useCase.execute("agua", 0.25);

    expect(challenges.lastProgressCall).toEqual({ challengeId: "agua", delta: 0.25 });
  });

  it("rejects a non-positive delta", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new IncrementDailyProgressUseCase(challenges);
    await expect(useCase.execute("agua", 0)).rejects.toThrow(/positive/);
    await expect(useCase.execute("agua", -1)).rejects.toThrow(/positive/);
  });
});
