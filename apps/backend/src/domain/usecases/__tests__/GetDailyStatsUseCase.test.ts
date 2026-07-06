import {
  InMemoryChallengeRepository,
  InMemoryProgressRepository,
  InMemoryStatsRepository,
  makeChallenge,
} from "../../../__tests__/testUtils/inMemoryRepos";
import { GetDailyStatsUseCase } from "../GetDailyStatsUseCase";
import { IncrementDailyProgressUseCase } from "../IncrementDailyProgressUseCase";
import { MarkDailyCheckUseCase } from "../MarkDailyCheckUseCase";

describe("GetDailyStatsUseCase", () => {
  const today = new Date("2027-06-10T12:00:00.000Z");

  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    const stats = new InMemoryStatsRepository();
    const useCase = new GetDailyStatsUseCase(challenges, stats);
    return { challenges, progress, stats, useCase };
  }

  it("averages completion across joined challenges and excludes STREAK from the completed count", async () => {
    const { challenges, progress, stats, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }), ["lia"]);
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);
    challenges.seed(makeChallenge({ id: "acucar", kind: "STREAK", target: 7 }), ["lia"]);

    await new IncrementDailyProgressUseCase(challenges, progress).execute({
      challengeId: "agua",
      userId: "lia",
      delta: 1,
      now: today,
    }); // 1 / 2 = 0.5
    await new MarkDailyCheckUseCase(challenges, progress).execute({
      challengeId: "treino8h",
      userId: "lia",
      now: today,
    }); // 1 / 1 = 1
    await new MarkDailyCheckUseCase(challenges, progress).execute({
      challengeId: "acucar",
      userId: "lia",
      now: today,
    }); // streak day 1 / 7 ≈ 0.14, excluded from completedChallenges

    const result = await useCase.execute({ userId: "lia", now: today });

    expect(result.totalChallenges).toBe(3);
    expect(result.completedChallenges).toBe(1); // only treino8h counts (agua isn't full, streak excluded)
    expect(result.completionPct).toBeCloseTo((0.5 + 1 + 1 / 7) / 3, 5);
    expect(result.date).toBe("2027-06-10");

    const saved = await stats.findRecentBefore("lia", "2027-06-11", 1);
    expect(saved[0]).toMatchObject({ date: "2027-06-10", completedChallenges: 1, totalChallenges: 3 });
  });

  it("reports a 0-day streak when today isn't fully completed", async () => {
    const { challenges, progress, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }), ["lia"]);
    await new IncrementDailyProgressUseCase(challenges, progress).execute({
      challengeId: "agua",
      userId: "lia",
      delta: 0.5,
      now: today,
    });

    const result = await useCase.execute({ userId: "lia", now: today });
    expect(result.streakDays).toBe(0);
  });

  it("counts consecutive fully-completed prior days into the streak", async () => {
    const { challenges, progress, stats, useCase } = setup();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    // Seed 3 prior fully-completed days directly (2027-06-07, 08, 09).
    for (const date of ["2027-06-07", "2027-06-08", "2027-06-09"]) {
      await stats.upsertSnapshot({
        userId: "lia",
        date,
        completedChallenges: 1,
        totalChallenges: 1,
        completionPct: 1,
        allCompleted: true,
      });
    }

    await new MarkDailyCheckUseCase(challenges, progress).execute({ challengeId: "treino8h", userId: "lia", now: today });
    const result = await useCase.execute({ userId: "lia", now: today });

    expect(result.streakDays).toBe(4); // today + 3 prior days
  });

  it("breaks the streak at the first gap day", async () => {
    const { challenges, progress, stats, useCase } = setup();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    await stats.upsertSnapshot({
      userId: "lia",
      date: "2027-06-09",
      completedChallenges: 1,
      totalChallenges: 1,
      completionPct: 1,
      allCompleted: true,
    });
    // 2027-06-08 is missing (gap) before an older completed day.
    await stats.upsertSnapshot({
      userId: "lia",
      date: "2027-06-07",
      completedChallenges: 1,
      totalChallenges: 1,
      completionPct: 1,
      allCompleted: true,
    });

    await new MarkDailyCheckUseCase(challenges, progress).execute({ challengeId: "treino8h", userId: "lia", now: today });
    const result = await useCase.execute({ userId: "lia", now: today });

    expect(result.streakDays).toBe(2); // today + 06-09, stops at the 06-08 gap
  });

  it("returns zeros when the user has no joined challenges", async () => {
    const { useCase } = setup();
    const result = await useCase.execute({ userId: "ghost", now: today });
    expect(result).toMatchObject({ totalChallenges: 0, completedChallenges: 0, completionPct: 0, streakDays: 0 });
  });
});
