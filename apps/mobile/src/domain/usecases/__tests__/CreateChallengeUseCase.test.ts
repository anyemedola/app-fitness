import { FakeChallengeRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { CreateChallengeUseCase } from "../CreateChallengeUseCase";

describe("CreateChallengeUseCase", () => {
  it("creates the challenge via the repository", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new CreateChallengeUseCase(challenges);

    const challenge = await useCase.execute({
      groupId: "suor",
      title: "100 flexões na semana",
      kind: "COUNT",
      cadence: "WEEKLY",
      target: 100,
    });

    expect(challenge.title).toBe("100 flexões na semana");
  });

  it("rejects an empty title", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new CreateChallengeUseCase(challenges);
    await expect(
      useCase.execute({ groupId: "suor", title: "   ", kind: "WATER", cadence: "DAILY", target: 2 }),
    ).rejects.toThrow(/nome/i);
  });

  it("rejects a non-positive target", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new CreateChallengeUseCase(challenges);
    await expect(
      useCase.execute({ groupId: "suor", title: "Água", kind: "WATER", cadence: "DAILY", target: 0 }),
    ).rejects.toThrow(/meta/i);
  });
});
