import { FakeStatsRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { GetDailyStatsUseCase } from "../GetDailyStatsUseCase";

describe("GetDailyStatsUseCase", () => {
  it("returns the daily stats from the repository", async () => {
    const stats = new FakeStatsRepository();
    const useCase = new GetDailyStatsUseCase(stats);

    const result = await useCase.execute("suor");

    expect(result).toBe(stats.stats);
  });
});
