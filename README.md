# Site Unseen

A web app that simulates speed dating events in real time. Configure event parameters and demographics, then watch a live simulation tick-by-tick or get instant results with full analytics.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Real-Time**: Socket.io (server-authoritative tick model)
- **Database**: PostgreSQL + Prisma ORM

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd site-unseen

# Install all dependencies (shared, back, front)
npm install

# Set up the database
cp back/.env.example back/.env   # edit DATABASE_URL
cd back && npx prisma migrate dev
cd ..

# Start development servers
npm run dev
```

The backend runs on `http://localhost:3001` and the frontend on `http://localhost:5173`.

## Project Structure

```
site-unseen/
  shared/     # Shared TypeScript types and Zod validators
  back/       # Express API + Socket.io server + simulation engine
  front/      # React SPA (Vite)
  reference/  # Domain rules (compatibility, event mechanics)
  requests/   # Numbered build requests (construction steps)
```

## Testing

```bash
# Run all tests across workspaces
npm test

# Run tests for a specific workspace
npm test --workspace=back
npm test --workspace=shared
npm test --workspace=front

# Watch mode
npm run test:watch --workspace=back
```

## Simulation Modes

- **Real-Time (Detailed)**: Server ticks every 1 second, broadcasting state to all connected viewers via Socket.io. 1 simulation minute = 1 real second.
- **Quick**: Server computes the entire simulation instantly and returns final statistics.

## Deployment

- **Backend**: Railway (Node.js service with PostgreSQL addon)
- **Frontend**: Vercel (static build from `front/`)

Set `FRONTEND_URL` on the backend and `VITE_API_URL` / `VITE_SOCKET_URL` on the frontend to point at each other.
