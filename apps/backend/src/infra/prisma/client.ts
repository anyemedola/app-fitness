import { PrismaClient } from "@prisma/client";

// A single shared instance avoids exhausting Postgres connections across hot reloads in dev.
export const prisma = new PrismaClient();
