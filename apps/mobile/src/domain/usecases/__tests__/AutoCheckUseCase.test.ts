import { FakeChallengeRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { AutoCheckUseCase } from "../AutoCheckUseCase";

describe("AutoCheckUseCase", () => {
  it("passes the completedAt timestamp through to the repository", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new AutoCheckUseCase(challenges);
    const completedAt = new Date("2027-06-10T06:30:00.000Z");

    await useCase.execute("treino8h", completedAt);

    expect(challenges.lastCheckCall).toEqual({ challengeId: "treino8h", completedAt });
  });

  it("defaults completedAt to now when omitted", async () => {
    const challenges = new FakeChallengeRepository();
    const useCase = new AutoCheckUseCase(challenges);

    await useCase.execute("treino8h");

    expect(challenges.lastCheckCall?.completedAt).toBeInstanceOf(Date);
  });
});
