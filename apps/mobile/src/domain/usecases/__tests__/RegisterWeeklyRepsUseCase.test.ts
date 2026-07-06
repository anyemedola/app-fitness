import { FakeChallengeRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { RegisterWeeklyRepsUseCase } from "../RegisterWeeklyRepsUseCase";

describe("RegisterWeeklyRepsUseCase", () => {
  it("delegates to the repository with the given reps", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new RegisterWeeklyRepsUseCase(challenges);

    await useCase.execute("flexoes", 30);

    expect(challenges.lastProgressCall).toEqual({ challengeId: "flexoes", delta: 30 });
  });

  it("rejects a non-positive rep count", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new RegisterWeeklyRepsUseCase(challenges);
    await expect(useCase.execute("flexoes", 0)).rejects.toThrow(/positive/);
  });
});
