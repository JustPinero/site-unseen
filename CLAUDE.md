# Site Unseen — Speed Dating Simulator

## Project Overview

A web app that simulates speed dating events in real time. Users configure event parameters and demographic distributions, then watch a live simulation or get instant results. Other users can view running simulations without falling out of sync.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Real-Time**: Socket.io (server-authoritative tick model)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Valentine's Day aesthetic (pinks, reds, hearts)

## Architecture Principles

### Server-Authoritative Simulation
The server is the single source of truth for simulation state. The server runs the simulation clock, computes ticks (1/second in detailed mode), and pushes state to all connected clients via Socket.io. Clients NEVER run their own timers or compute simulation state — they only render what the server sends. This prevents sync drift.

### Join Anytime
When a viewer connects to an in-progress simulation, the server sends a full state snapshot immediately. The viewer catches up instantly and then receives normal ticks going forward.

### Two Simulation Modes
1. **Detailed (Real-Time)**: Server ticks every 1 second, broadcasting state. 1 sim minute = 1 real second. Viewers see a live table of all current dates.
2. **Quick**: Server computes entire simulation instantly, returns only final statistics. No tick broadcasting.

## Project Structure

```
site-unseen/
  CLAUDE.md              # This file — project rules and conventions
  reference/             # Domain rules (compatibility, event rules)
  requests/              # Numbered build requests (construction steps)
  core_commands/         # Agent workflow commands (commit, execute, plan, prime)
  front/                 # React + TypeScript frontend (Vite)
  back/                  # Node.js + Express + Socket.io backend
```

## Conventions

### Code Style
- TypeScript strict mode everywhere
- Shared types live in a `shared/` directory (or package) imported by both front and back
- Use interfaces over type aliases where possible
- Descriptive variable names, no abbreviations
- No `any` types without justification

### Naming
- Files: kebab-case (`simulation-engine.ts`)
- Components: PascalCase (`SimulationView.tsx`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Database tables: snake_case (Prisma convention)

### Git
- Conventional commits: `type(scope): description`
- Scopes: `front`, `back`, `shared`, `db`, `docs`, `infra`
- Reference request numbers: `Implements request #001`

### API
- RESTful endpoints under `/api/v1/`
- Socket.io namespace: `/simulation`
- All inputs validated with Zod
- Consistent error response format

## Key Domain Rules

- See `reference/compatibility-rules.md` for matching logic
- See `reference/event-rules.md` for simulation mechanics
- Server ticks are the ONLY source of simulation time — no client-side timers

## Construction Requests

Build requests are in `requests/` numbered sequentially. Each is self-contained with enough context for implementation without prior conversation history. Execute them in order.
