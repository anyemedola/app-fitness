import { InMemoryChallengeRepository } from "../../../__tests__/testUtils/inMemoryRepos";
import { CreateChallengeUseCase } from "../CreateChallengeUseCase";

describe("CreateChallengeUseCase", () => {
  function setup() {
    const challenges = new InMemoryChallengeRepository();
    const useCase = new CreateChallengeUseCase(challenges);
    return { challenges, useCase };
  }

  it("creates the challenge and enrolls the owner", async () => {
    const { challenges, useCase } = setup();
    const challenge = await useCase.execute({
      groupId: "suor",
      ownerId: "lia",
      title: "100 flexões na semana",
      kind: "COUNT",
      cadence: "WEEKLY",
      unit: "reps",
      target: 100,
    });

    expect(challenge.title).toBe("100 flexões na semana");
    const joined = await challenges.findJoinedByUser("lia", "suor");
    expect(joined).toHaveLength(1);
    expect(joined[0]?.challenge.id).toBe(challenge.id);
  });

  it("rejects an empty title", async () => {
    const { useCase } = setup();
    await expect(
      useCase.execute({ groupId: "suor", ownerId: "lia", title: "   ", kind: "WATER", cadence: "DAILY", target: 2 }),
    ).rejects.toThrow(/title/);
  });

  it("rejects a non-positive target", async () => {
    const { useCase } = setup();
    await expect(
      useCase.execute({ groupId: "suor", ownerId: "lia", title: "Água", kind: "WATER", cadence: "DAILY", target: 0 }),
    ).rejects.toThrow(/target/);
  });
});
