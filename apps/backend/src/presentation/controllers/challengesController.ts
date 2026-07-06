import type { Response, Router } from "express";
import { z } from "zod";

import type { ChallengeRepository } from "../../domain/repositories/ChallengeRepository";
import type {
  AutoCheckUseCase,
  IncrementDailyProgressUseCase,
  MarkDailyCheckUseCase,
  RegisterWeeklyRepsUseCase,
  UploadPhotoUseCase,
} from "../../domain/usecases";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware";

export interface ChallengesControllerDeps {
  challenges: ChallengeRepository;
  incrementDailyProgress: IncrementDailyProgressUseCase;
  registerWeeklyReps: RegisterWeeklyRepsUseCase;
  uploadPhoto: UploadPhotoUseCase;
  markDailyCheck: MarkDailyCheckUseCase;
  autoCheck: AutoCheckUseCase;
}

const progressBodySchema = z.object({ delta: z.number() });
const photoBodySchema = z.object({ photoUrl: z.string().url() });
const checkBodySchema = z.object({ completedAt: z.string().datetime().optional() });

function requireUserId(req: AuthenticatedRequest, res: Response): string | null {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthenticated" });
    return null;
  }
  return req.userId;
}

/** `req.params.id` is always set for routes matching `/:id` — this just satisfies
 * `noUncheckedIndexedAccess` without a bare non-null assertion at every call site. */
function requireChallengeId(req: AuthenticatedRequest, res: Response): string | null {
  if (!req.params.id) {
    res.status(400).json({ error: "Missing challenge id in the URL" });
    return null;
  }
  return req.params.id;
}

export function registerChallengesRoutes(router: Router, deps: ChallengesControllerDeps): void {
  router.get("/challenges/today", async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;
      const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;

      const joined = await deps.challenges.findJoinedByUser(userId, groupId);
      res.json({
        challenges: joined.map(({ challenge, value, periodKey }) => ({
          id: challenge.id,
          groupId: challenge.groupId,
          title: challenge.title,
          description: challenge.description,
          kind: challenge.kind,
          cadence: challenge.cadence,
          unit: challenge.unit,
          target: challenge.target,
          requirePhoto: challenge.requirePhoto,
          value,
          periodKey,
        })),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/challenges/:id/progress", async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;
      const { delta } = progressBodySchema.parse(req.body);
      const challengeId = requireChallengeId(req, res);
      if (!challengeId) return;

      const challenge = await deps.challenges.findById(challengeId);
      if (!challenge) {
        res.status(404).json({ error: `Challenge ${challengeId} not found` });
        return;
      }

      const entry =
        challenge.kind === "WATER"
          ? await deps.incrementDailyProgress.execute({ challengeId, userId, delta })
          : challenge.kind === "COUNT"
            ? await deps.registerWeeklyReps.execute({ challengeId, userId, delta })
            : null;

      if (!entry) {
        res.status(400).json({ error: `Challenge kind ${challenge.kind} does not accept /progress updates` });
        return;
      }
      res.json({ entry });
    } catch (err) {
      next(err);
    }
  });

  router.post("/challenges/:id/photo", async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;
      const { photoUrl } = photoBodySchema.parse(req.body);
      const challengeId = requireChallengeId(req, res);
      if (!challengeId) return;
      const entry = await deps.uploadPhoto.execute({ challengeId, userId, photoUrl });
      res.json({ entry });
    } catch (err) {
      next(err);
    }
  });

  router.post("/challenges/:id/check", async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;
      const { completedAt } = checkBodySchema.parse(req.body ?? {});
      const challengeId = requireChallengeId(req, res);
      if (!challengeId) return;

      if (completedAt) {
        const result = await deps.autoCheck.execute({
          challengeId,
          userId,
          completedAt: new Date(completedAt),
        });
        res.json(result);
        return;
      }

      const entry = await deps.markDailyCheck.execute({ challengeId, userId });
      res.json({ entry });
    } catch (err) {
      next(err);
    }
  });
}
