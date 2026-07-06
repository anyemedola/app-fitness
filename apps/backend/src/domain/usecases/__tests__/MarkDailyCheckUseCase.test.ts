import { InMemoryChallengeRepository, InMemoryProgressRepository, makeChallenge } from "../../../__tests__/testUtils/inMemoryRepos";
import { MarkDailyCheckUseCase } from "../MarkDailyCheckUseCase";

describe("MarkDailyCheckUseCase", () => {
  const day1 = new Date("2027-06-10T10:00:00.000Z");
  const day2 = new Date("2027-06-11T10:00:00.000Z");
  const day3SkipOne = new Date("2027-06-13T10:00:00.000Z"); // skipped day2's follow-up

  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    const useCase = new MarkDailyCheckUseCase(challenges, progress);
    return { challenges, useCase };
  }

  describe("YESNO", () => {
    it("marks done on first check", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }));
      const entry = await useCase.execute({ challengeId: "treino8h", userId: "teo", now: day1 });
      expect(entry.value).toBe(1);
    });

    it("toggles back to undone when checked again the same day", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }));
      await useCase.execute({ challengeId: "treino8h", userId: "teo", now: day1 });
      const entry = await useCase.execute({ challengeId: "treino8h", userId: "teo", now: day1 });
      expect(entry.value).toBe(0);
    });
  });

  describe("STREAK", () => {
    it("starts the streak at 1", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "acucar", kind: "STREAK", target: 7 }));
      const entry = await useCase.execute({ challengeId: "acucar", userId: "camila", now: day1 });
      expect(entry.value).toBe(1);
    });

    it("continues the streak on the very next day", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "acucar", kind: "STREAK", target: 7 }));
      await useCase.execute({ challengeId: "acucar", userId: "camila", now: day1 });
      const entry = await useCase.execute({ challengeId: "acucar", userId: "camila", now: day2 });
      expect(entry.value).toBe(2);
    });

    it("resets to 1 after a missed day", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "acucar", kind: "STREAK", target: 7 }));
      await useCase.execute({ challengeId: "acucar", userId: "camila", now: day1 });
      await useCase.execute({ challengeId: "acucar", userId: "camila", now: day2 });
      // day3SkipOne is two days after day2 — day "2027-06-12" was never checked in.
      const entry = await useCase.execute({ challengeId: "acucar", userId: "camila", now: day3SkipOne });
      expect(entry.value).toBe(1);
    });

    it("caps at the target", async () => {
      const { challenges, useCase } = setup();
      challenges.seed(makeChallenge({ id: "acucar", kind: "STREAK", target: 2 }));
      await useCase.execute({ challengeId: "acucar", userId: "camila", now: day1 });
      await useCase.execute({ challengeId: "acucar", userId: "camila", now: day2 });
      const entry = await useCase.execute({
        challengeId: "acucar",
        userId: "camila",
        now: new Date("2027-06-12T10:00:00.000Z"),
      });
      expect(entry.value).toBe(2);
    });
  });

  it("rejects unsupported kinds", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));
    await expect(useCase.execute({ challengeId: "agua", userId: "lia", now: day1 })).rejects.toThrow(
      /does not support/,
    );
  });
});
