import { FakeChallengeRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { MarkDailyCheckUseCase } from "../MarkDailyCheckUseCase";

describe("MarkDailyCheckUseCase", () => {
  it("delegates to the repository's check() with no completedAt (manual check-in)", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new MarkDailyCheckUseCase(challenges);

    const result = await useCase.execute("treino8h");

    expect(challenges.lastCheckCall).toEqual({ challengeId: "treino8h", completedAt: undefined });
    expect(result).toBe(challenges.checkResult);
  });
});
