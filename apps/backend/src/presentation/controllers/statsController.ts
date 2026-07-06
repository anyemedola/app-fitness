import type { Router } from "express";

import type { GetDailyStatsUseCase } from "../../domain/usecases";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware";

export interface StatsControllerDeps {
  getDailyStats: GetDailyStatsUseCase;
}

export function registerStatsRoutes(router: Router, deps: StatsControllerDeps): void {
  router.get("/stats", async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
      }
      const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;
      const stats = await deps.getDailyStats.execute({ userId: req.userId, groupId });
      res.json(stats);
    } catch (err) {
      next(err);
    }
  });
}
