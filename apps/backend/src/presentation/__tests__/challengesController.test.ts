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
  return { app, challenges, progress };
}

describe("GET /challenges/today", () => {
  it("requires authentication", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/challenges/today");
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/challenges/today").set("Authorization", "Bearer nope");
    expect(res.status).toBe(401);
  });

  it("lists the user's joined challenges with current progress", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2, unit: "L" }), ["lia"]);
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }), ["bruno"]);

    const res = await request(app).get("/challenges/today").set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.challenges).toHaveLength(1);
    expect(res.body.challenges[0]).toMatchObject({ id: "agua", kind: "WATER", value: 0 });
  });
});

describe("POST /challenges/:id/progress", () => {
  it("increments a WATER challenge", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }), ["lia"]);

    const res = await request(app)
      .post("/challenges/agua/progress")
      .set("Authorization", "Bearer valid-token")
      .send({ delta: 0.25 });

    expect(res.status).toBe(200);
    expect(res.body.entry.value).toBe(0.25);
  });

  it("registers reps on a COUNT challenge", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "flexoes", kind: "COUNT", target: 100 }), ["lia"]);

    const res = await request(app)
      .post("/challenges/flexoes/progress")
      .set("Authorization", "Bearer valid-token")
      .send({ delta: 30 });

    expect(res.status).toBe(200);
    expect(res.body.entry.value).toBe(30);
  });

  it("400s for a kind that doesn't support /progress", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    const res = await request(app)
      .post("/challenges/treino8h/progress")
      .set("Authorization", "Bearer valid-token")
      .send({ delta: 1 });

    expect(res.status).toBe(400);
  });

  it("404s for an unknown challenge", async () => {
    const { app } = buildApp();
    const res = await request(app)
      .post("/challenges/missing/progress")
      .set("Authorization", "Bearer valid-token")
      .send({ delta: 1 });
    expect(res.status).toBe(404);
  });

  it("400s on an invalid body", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }), ["lia"]);
    const res = await request(app)
      .post("/challenges/agua/progress")
      .set("Authorization", "Bearer valid-token")
      .send({ delta: "not-a-number" });
    expect(res.status).toBe(400);
  });
});

describe("POST /challenges/:id/photo", () => {
  it("records the photo check-in", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "salada", kind: "PHOTO", target: 1, requirePhoto: true }), ["lia"]);

    const res = await request(app)
      .post("/challenges/salada/photo")
      .set("Authorization", "Bearer valid-token")
      .send({ photoUrl: "https://storage.example/photo.jpg" });

    expect(res.status).toBe(200);
    expect(res.body.entry).toMatchObject({ value: 1, photoUrl: "https://storage.example/photo.jpg" });
  });

  it("400s for a non-URL photoUrl", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "salada", kind: "PHOTO", target: 1 }), ["lia"]);
    const res = await request(app)
      .post("/challenges/salada/photo")
      .set("Authorization", "Bearer valid-token")
      .send({ photoUrl: "not-a-url" });
    expect(res.status).toBe(400);
  });
});

describe("POST /challenges/:id/check", () => {
  it("marks a YESNO challenge done", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    const res = await request(app)
      .post("/challenges/treino8h/check")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.entry.value).toBe(1);
  });

  it("qualifies an auto-check before the cutoff via completedAt", async () => {
    const { app, challenges } = buildApp();
    challenges.seed(makeChallenge({ id: "treino8h", kind: "YESNO", target: 1 }), ["lia"]);

    const res = await request(app)
      .post("/challenges/treino8h/check")
      .set("Authorization", "Bearer valid-token")
      .send({ completedAt: "2027-06-10T06:30:00.000Z" });

    expect(res.status).toBe(200);
    expect(res.body.qualified).toBe(true);
  });
});
