import request from "supertest";

import {
  InMemoryChallengeRepository,
  InMemoryProgressRepository,
  InMemoryStatsRepository,
  makeChallenge,
} from "../../__tests__/testUtils/inMemoryRepos";
import { createServer } from "../../infra/http/server";

function buildApp() {
  const progress = new InMemoryProgressRepository();
  const challenges = new InMemoryChallengeRepository(progress);
  const stats = new InMemoryStatsRepository();
  const app = createServer({
    verifyIdToken: async (token) => {
      if (token !== "valid-token") throw new Error("invalid");
      return { uid: "lia" };
    },
    challenges,
    progress,
    stats,
  });
  return { app, challenges, progress, stats };
}

describe("GET /stats", () => {
  it("requires authentication", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/stats");
    expect(res.status).toBe(401);
  });

  it("returns today's completion for the caller", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    await request(app).post("/challenges/treino8h/check").set("Authorization", "Bearer valid-token").send({});

    const res = await request(app).get("/stats").set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ totalChallenges: 1, completedChallenges: 1, completionPct: 1, streakDays: 1 });
  });

  it("scopes to a group when ?groupId is given", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "agua", groupId: "suor", kind: "WATER", target: 2 }), ["lia"]);
    challenges.seed(makeChallenge({ id: "flexoes", groupId: "firma", kind: "COUNT", target: 100 }), ["lia"]);

    const res = await request(app).get("/stats?groupId=suor").set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.totalChallenges).toBe(1);
  });
});
