# API image. Build from the repo root: docker build -f infrastructure/Dockerfile -t corgi-ai .
FROM node:26-alpine AS deps
WORKDIR /app
# npm needs every workspace manifest to validate the lockfile, even ones not installed here
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/shared/package.json packages/shared/
RUN npm ci --omit=dev --ignore-scripts -w @corgi-ai/api

FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node packages/config/package.json packages/config/tsconfig.base.json ./packages/config/
COPY --chown=node:node packages/shared/package.json ./packages/shared/
COPY --chown=node:node packages/shared/src ./packages/shared/src
COPY --chown=node:node apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY --chown=node:node apps/api/src ./apps/api/src
WORKDIR /app/apps/api
USER node
EXPOSE 3000
CMD ["/app/node_modules/.bin/tsx", "src/index.ts"]
