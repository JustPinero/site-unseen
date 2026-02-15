# Request #002 — Data Models & Database Schema

**Status**: Not Started
**Dependencies**: Request #001 (Project Scaffolding)

## Description

Define all Prisma models and shared TypeScript types for attendees, simulations, dates, and results. This is the data foundation the entire app builds on.

## Requirements

### Prisma Schema (`back/prisma/schema.prisma`)

**Simulation** model:
- `id` — UUID primary key
- `name` — user-given name for the simulation
- `status` — enum: PENDING, RUNNING, COMPLETED
- `mode` — enum: DETAILED, QUICK
- `eventLengthMinutes` — integer (15–180)
- `dateLengthMinutes` — integer (2–15)
- `breakLengthMinutes` — integer (0–5)
- `attendeeCount` — integer (4–100)
- `createdAt`, `updatedAt` — timestamps

**Attendee** model:
- `id` — UUID primary key
- `simulationId` — FK to Simulation
- `name` — string (generated)
- `gender` — enum: MALE, FEMALE
- `sexuality` — enum: HETEROSEXUAL, HOMOSEXUAL, BISEXUAL
- `age` — integer
- `ethnicity` — string
- `interests` — string array (JSON or Postgres array)

**SimulatedDate** model:
- `id` — UUID primary key
- `simulationId` — FK to Simulation
- `roundNumber` — integer
- `attendeeAId` — FK to Attendee
- `attendeeBId` — FK to Attendee
- `durationMinutes` — integer (actual duration, may be less than date length if early exit)
- `endedEarly` — boolean
- `compatibilityScore` — integer (0–100)

**SimulationResult** model:
- `id` — UUID primary key
- `simulationId` — FK to Simulation (unique, one-to-one)
- `totalRounds` — integer
- `totalDatesCompleted` — integer
- `totalEarlyExits` — integer
- `averageDatesPerAttendee` — float
- `resultData` — JSON (flexible stats blob for graphs)

### Shared Types (`shared/types/`)

Mirror all Prisma models as TypeScript interfaces for frontend use. Include:
- `Simulation`, `Attendee`, `SimulatedDate`, `SimulationResult`
- Enums: `Gender`, `Sexuality`, `SimulationStatus`, `SimulationMode`
- `SimulationConfig` — the input shape for creating a simulation
- `SimulationTick` — the real-time state broadcast shape (from event-rules.md)
- `AttendeeSnapshot` — lightweight attendee for tick data

### Zod Schemas (`shared/validators/`)

- `simulationConfigSchema` — validates user input for creating a simulation
- Enforce min/max constraints from event-rules.md

## Acceptance Criteria

- [ ] `npx prisma validate` passes
- [ ] `npx prisma generate` produces client without errors
- [ ] `npx prisma db push` creates tables in PostgreSQL
- [ ] All shared types compile without errors
- [ ] Zod schema validates correct configs and rejects invalid ones
