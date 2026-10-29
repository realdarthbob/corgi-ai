# Build from the repo root: docker build -f infrastructure/Dockerfile -t corgi-ai .
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json tsconfig.json ./
COPY --chown=node:node src ./src
USER node
EXPOSE 3000
CMD ["node_modules/.bin/tsx", "src/index.ts"]
