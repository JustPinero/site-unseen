# Request #001 — Project Scaffolding

**Status**: Not Started
**Dependencies**: None

## Description

Set up the full project structure with a React + TypeScript frontend (Vite), a Node.js + Express + Socket.io + TypeScript backend, shared types package, and PostgreSQL via Prisma.

## Requirements

### Backend (`back/`)
- Initialize a fresh Node.js + TypeScript project (remove old MySQL-based code)
- Express server with Socket.io integration
- Prisma ORM configured for PostgreSQL
- TypeScript strict mode
- Dev server with hot reload (ts-node-dev or tsx)
- Scripts: `dev`, `build`, `start`
- Environment config via `.env` (DATABASE_URL, PORT)

### Frontend (`front/`)
- React + TypeScript via Vite
- Socket.io client installed
- React Router for page navigation
- A CSS solution for Valentine's Day theming (CSS modules or Tailwind)
- Scripts: `dev`, `build`, `preview`

### Shared Types (`shared/`)
- Shared TypeScript types and interfaces used by both front and back
- Zod schemas for validation
- Exported as a local package or path alias

### Root Level
- Root `package.json` with workspace scripts to run both front and back
- `.env.example` with required environment variables
- Update `.gitignore` for Prisma, Vite, and env files

## Acceptance Criteria

- [ ] `cd back && npm run dev` starts the Express + Socket.io server
- [ ] `cd front && npm run dev` starts the Vite dev server
- [ ] TypeScript compiles without errors in both packages
- [ ] Prisma can connect to a local PostgreSQL database
- [ ] Socket.io client can connect to the server (basic ping/pong test)
- [ ] Shared types are importable from both front and back
