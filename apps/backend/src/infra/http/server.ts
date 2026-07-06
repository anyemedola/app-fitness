import cors from "cors";
import express, { Router, type Express } from "express";

import type { ChallengeRepository } from "../../domain/repositories/ChallengeRepository";
import type { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import type { StatsRepository } from "../../domain/repositories/StatsRepository";
import {
  AutoCheckUseCase,
  GetDailyStatsUseCase,
  IncrementDailyProgressUseCase,
  MarkDailyCheckUseCase,
  RegisterWeeklyRepsUseCase,
  UploadPhotoUseCase,
} from "../../domain/usecases";
import { registerChallengesRoutes } from "../../presentation/controllers/challengesController";
import { registerStatsRoutes } from "../../presentation/controllers/statsController";
import { createAuthMiddleware, type IdTokenVerifier } from "../../presentation/middlewares/authMiddleware";
import { errorHandler } from "../../presentation/middlewares/errorHandler";

export interface ServerDeps {
  verifyIdToken: IdTokenVerifier;
  challenges: ChallengeRepository;
  progress: ProgressRepository;
  stats: StatsRepository;
}

/** Wires domain use-cases to HTTP routes. Repositories/auth are injected so tests can fake them. */
export function createServer(deps: ServerDeps): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  const router = Router();
  router.use(createAuthMiddleware(deps.verifyIdToken));

  registerChallengesRoutes(router, {
    challenges: deps.challenges,
    incrementDailyProgress: new IncrementDailyProgressUseCase(deps.challenges, deps.progress),
    registerWeeklyReps: new RegisterWeeklyRepsUseCase(deps.challenges, deps.progress),
    uploadPhoto: new UploadPhotoUseCase(deps.challenges, deps.progress),
    markDailyCheck: new MarkDailyCheckUseCase(deps.challenges, deps.progress),
    autoCheck: new AutoCheckUseCase(deps.challenges, deps.progress),
  });

  registerStatsRoutes(router, {
    getDailyStats: new GetDailyStatsUseCase(deps.challenges, deps.stats),
  });

  app.use(router);
  app.use(errorHandler);

  return app;
}
