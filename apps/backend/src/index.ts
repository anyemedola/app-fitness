import "dotenv/config";

import {
  PrismaChallengeRepository,
  PrismaProgressRepository,
  PrismaStatsRepository,
} from "./data/repositories";
import { verifyFirebaseIdToken } from "./infra/auth/firebaseAdmin";
import { createServer } from "./infra/http/server";
import { prisma } from "./infra/prisma/client";

const port = Number(process.env.PORT ?? 4000);

const app = createServer({
  verifyIdToken: verifyFirebaseIdToken,
  challenges: new PrismaChallengeRepository(prisma),
  progress: new PrismaProgressRepository(prisma),
  stats: new PrismaStatsRepository(prisma),
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app-fitness backend listening on http://localhost:${port}`);
});
