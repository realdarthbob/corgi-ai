# Corgi AI

Agentic AI for a Corgi Management System.

Upload documents about your corgis — vet records, vaccination history, pedigree papers, feeding plans, training notes — and ask questions in plain language through a chat interface. An AI agent reads the documents, finds the relevant passages, and answers with references to where the information came from.

> **Status:** early development. The API server skeleton, a bare web app, tooling and CI/CD are in place; the document, AI and chat features below are planned and not yet implemented.

## What it will do

- **Document upload** — submit corgi-related documents (PDF, text, Markdown and similar formats) through the API.
- **Ingestion** — documents are parsed, split into chunks, and indexed for retrieval.
- **Retrieval-augmented answers** — ask things like _"When is Biscuit's next rabies booster due?"_ or _"Which of my corgis are on a grain-free diet?"_ and get answers grounded in your uploaded documents.
- **Agentic workflow** — a LangGraph agent decides which documents and tools to use, can combine information across multiple documents, and says so when the documents don't contain an answer.
- **Source citations** — every answer points back to the document(s) it was based on.
- **Chat interface** — a web UI to upload documents and talk to the agent.

## Tech stack

| Area        | Choice                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Runtime     | Node.js 26, TypeScript (run via `tsx`)                                                                             |
| HTTP server | [Fastify](https://fastify.dev/)                                                                                    |
| Frontend    | [React](https://react.dev/), [Vite](https://vite.dev/)                                                             |
| Agent / LLM | [LangChain](https://js.langchain.com/), [LangGraph](https://langchain-ai.github.io/langgraphjs/), Anthropic Claude |
| Validation  | [Zod](https://zod.dev/)                                                                                            |
| Tooling     | ESLint, Prettier, Husky, lint-staged                                                                               |
| Testing     | Node.js built-in test runner (API), Vitest + Testing Library (web)                                                 |
| Deployment  | Docker, GitHub Actions                                                                                             |
| Monorepo    | npm workspaces                                                                                                     |

## Getting started

### Prerequisites

- Node.js 26 (`nvm use` picks it up from `.nvmrc`)
- npm

### Install and run

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run dev
```

This starts the API on `http://localhost:3000` and the web app on `http://localhost:5173`. In development the web app proxies `/api` requests to the API. Use `npm start` to run only the API.

### Configuration

Each app reads its own `.env` file. The `.env` files are gitignored; the committed `.env.example` files list every variable and its default. Without a `.env`, the defaults below are used.

| File            | Variable   | Default                 | Description                                                               |
| --------------- | ---------- | ----------------------- | ------------------------------------------------------------------------- |
| `apps/api/.env` | `PORT`     | `3000`                  | API port                                                                  |
| `apps/api/.env` | `HOST`     | `0.0.0.0`               | API bind address                                                          |
| `apps/web/.env` | `WEB_PORT` | `5173`                  | Port for the web dev and preview servers                                  |
| `apps/web/.env` | `API_URL`  | `http://localhost:3000` | Where the web dev server sends `/api` requests; must match the API `PORT` |

If you change the API `PORT`, update `API_URL` to match.

```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok"}
```

### Docker

The image contains the API only.

```bash
docker build -f infrastructure/Dockerfile -t corgi-ai .
docker run -p 3000:3000 corgi-ai
# or on another port: docker run -e PORT=8080 -p 8080:8080 corgi-ai
```

## Project structure

This is an npm workspaces monorepo. Each workspace has its own `package.json`, TypeScript config, ESLint config and scripts.

| Workspace         | Package            | Description                                         |
| ----------------- | ------------------ | --------------------------------------------------- |
| `apps/api`        | `@corgi-ai/api`    | Fastify API and AI agent                            |
| `apps/web`        | `@corgi-ai/web`    | React + Vite web app                                |
| `packages/shared` | `@corgi-ai/shared` | Zod schemas and types shared by the API and web app |
| `packages/config` | `@corgi-ai/config` | Shared TypeScript and ESLint configuration          |

## Development

Run from the repo root to cover all workspaces:

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the API and web app in watch mode |
| `npm start`         | Start the API                           |
| `npm test`          | Run tests                               |
| `npm run typecheck` | Type-check with `tsc`                   |
| `npm run lint`      | Lint with ESLint                        |
| `npm run build`     | Build the web app                       |
| `npm run format`    | Format with Prettier                    |
| `npm run check`     | Typecheck, lint, format check and tests |

To run a script in one workspace, use `npm run <script> -w @corgi-ai/<name>` or run it from inside that workspace's folder.

A pre-commit hook runs lint-staged and the type checker. CI runs `typecheck`, `lint`, `format:check`, `test` and `build` on every push and pull request, then builds the Docker image.

### Releasing

```bash
npm run release:patch   # or release:minor / release:major
```

This bumps the version, creates a `vX.Y.Z` tag and pushes it; the release workflow then verifies and publishes a GitHub release.

## API

| Method | Path             | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/`              | Server running check |
| GET    | `/api/v1/health` | Health check         |

Document upload and question-answering endpoints will be added here as they are built.

## Roadmap

- [x] Fastify server, health endpoint, tooling, Docker, CI/CD
- [x] Monorepo with API, web app and shared packages
- [ ] Document upload endpoint
- [ ] Document parsing and chunking
- [ ] Embeddings and vector store
- [ ] LangGraph retrieval agent backed by Claude
- [ ] Question-answering endpoint with source citations
- [ ] Chat interface in the web app
- [ ] Corgi profiles linking documents to individual dogs

## License

ISC
