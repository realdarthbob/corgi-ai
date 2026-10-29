# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

**Corgi AI** is an agentic AI system for a Corgi Management System. Users upload documents describing their corgis (health records, vet reports, pedigree papers, feeding plans, training notes, etc.), and an AI agent ingests them and answers questions by retrieving the relevant information from those documents. Users interact through a chat interface.

Current status: **infrastructure only**. The Fastify server, health endpoint, a bare React app, tooling, Docker image and CI/CD are in place. Document upload, ingestion, retrieval, the agent and the chat UI are not implemented yet — do not assume they exist.

See [README.md](README.md) for the product overview, setup, Docker, release instructions and roadmap.

## Monorepo layout

npm workspaces, no build orchestrator. Every workspace is **self-contained**: its own `package.json` (deps and devDeps), `tsconfig.json`, `eslint.config.ts` and scripts. Anything identical across workspaces is shared through a workspace package, not copy-pasted.

```
package.json            # root: workspaces list, aggregate scripts, repo-wide tooling only
prettier.config.js      # one Prettier config for the whole repo
apps/
  api/                  # @corgi-ai/api — Fastify backend + (future) LangGraph agent
    src/
      index.ts          # entrypoint: creates Fastify app, calls initApi, listens on env.HOST:env.PORT
      env.ts            # Zod-validated environment config (PORT, HOST)
      api.ts            # initApi(): registers root route and all route plugins
      routes/           # one Fastify plugin per resource, mounted under /api/v1/<resource>
        health.ts
        health.test.ts  # tests live next to the code they test
  web/                  # @corgi-ai/web — React + Vite frontend (bare scaffold)
    vite.config.ts      # dev proxy /api -> http://localhost:3000, Vitest config
    src/
packages/
  config/               # @corgi-ai/config — tsconfig.base.json + eslint.base.ts extended by every workspace
  shared/               # @corgi-ai/shared — Zod schemas/types shared by api and web (TS source, no build)
infrastructure/         # API Dockerfile
.github/workflows/      # ci.yml (check + build + docker), release.yml (tag-triggered GitHub release)
```

## Tech stack

- **Runtime:** Node.js 26 (see `.nvmrc`), ESM everywhere, TypeScript with `noEmit` (no compile step)
- **API:** Fastify 5, run via `tsx`; LangChain (`@langchain/core`), LangGraph (`@langchain/langgraph`), Claude via `@langchain/anthropic`
- **Web:** React 19, Vite 8
- **Validation:** Zod 4
- **Tooling:** ESLint (flat config, `typescript-eslint`), Prettier, Husky + lint-staged
- **Tests:** api uses the built-in `node:test` runner with `node:assert/strict`; web uses Vitest + Testing Library (jsdom)

## Commands

From the repo root (aggregate across workspaces):

```bash
npm install            # installs every workspace
npm run dev            # api on :3000 + web on :5173 (web proxies /api to the api)
npm start              # api only
npm test               # all workspace tests
npm run typecheck      # tsc --noEmit in each workspace
npm run lint           # eslint in each workspace
npm run format:check   # prettier --check (repo-wide)
npm run build          # build workspaces that have a build (web)
npm run check          # typecheck + lint + format:check + test — run before committing
```

One workspace: `npm run <script> -w @corgi-ai/<api|web|shared>`, or `cd` into it and run `npm run <script>`.
Add a dependency: `npm install <pkg> -w @corgi-ai/<name>` (use `-D` for dev). Never add workspace deps to the root `package.json`.

## Conventions

- Inside `apps/*`, import internal modules via the `@/` alias with an explicit extension: `import { initApi } from '@/api.ts';`. In `packages/*`, use **relative** imports only — `@/` resolves against the consuming workspace.
- Import shared code by package name: `import { healthResponseSchema } from '@corgi-ai/shared';`. Request/response and event shapes used by both api and web belong in `packages/shared` as Zod schemas, with types derived via `z.infer`.
- The web app talks to the backend only over HTTP at `/api/v1/*`; never import from `apps/api` in `apps/web` or vice versa.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is on).
- TypeScript is strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — handle `undefined` explicitly.
- New API routes: export an async Fastify plugin from `apps/api/src/routes/<name>.ts` and register it in `apps/api/src/api.ts` with a `/api/v1/<name>` prefix.
- API tests: build the app with `initApi` and use `app.inject(...)`; close the app in `t.after`. Web tests: `*.test.tsx` next to the component, using Testing Library queries.
- Shared lint/TS rules go in `packages/config`; workspace-specific ones (globals, React plugins, `lib`, `jsx`) stay in that workspace's config.
- Keep `packages/config`'s tooling in `devDependencies`: npm treats workspaces as prod deps of the root, so its `dependencies` would end up in the production API image.
- Validate request input and LLM structured output with Zod.
- Environment config is per app. Each app has a gitignored `.env` and a committed `.env.example`, and every new variable goes into `.env.example` too.
  - **API:** variables are declared and validated in `apps/api/src/env.ts`. Code reads them from the exported `env`, never from `process.env` directly. The npm scripts load `.env` through Node's `--env-file-if-exists`.
  - **Web:** `vite.config.ts` reads `WEB_PORT` and `API_URL`. Only `VITE_*` variables reach the browser bundle, so never put secrets in a `VITE_*` variable.
- Never commit secrets (e.g. `ANTHROPIC_API_KEY`); read them from environment variables.
- Don't bump versions, create tags or run release scripts unless asked.
