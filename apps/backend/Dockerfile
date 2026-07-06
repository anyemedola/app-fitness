# Multi-stage build for the Node/Prisma backend. Build from the monorepo root:
#   docker build -f apps/backend/Dockerfile -t app-fitness-backend .
#
# Uses `pnpm deploy` to produce a self-contained package directory (real files, not the
# workspace's usual symlinked node_modules), which is what actually copies cleanly into a
# separate final image stage.
FROM node:20.9.0-slim AS base
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app-fitness/backend prisma:generate
RUN pnpm --filter @app-fitness/backend build
RUN pnpm --filter @app-fitness/backend deploy --prod --legacy /app/deploy

FROM node:20.9.0-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/deploy/dist ./dist
COPY --from=build /app/deploy/prisma ./prisma
COPY --from=build /app/deploy/node_modules ./node_modules
COPY --from=build /app/deploy/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/index.js"]
