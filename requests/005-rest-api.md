# Request #005 — REST API Endpoints

**Status**: Not Started
**Dependencies**: Request #002 (Data Models)

## Description

Build the REST API for creating, configuring, listing, and retrieving simulations and their results. These endpoints handle the CRUD operations — the real-time stuff is handled by Socket.io (Request #004).

## Requirements

### Routes (`back/src/routes/`)

All routes under `/api/v1/`.

**Simulations**:

| Method | Path                          | Description                              |
|--------|-------------------------------|------------------------------------------|
| POST   | `/api/v1/simulations`         | Create a new simulation with config      |
| GET    | `/api/v1/simulations`         | List all simulations (paginated)         |
| GET    | `/api/v1/simulations/:id`     | Get simulation details                   |
| DELETE | `/api/v1/simulations/:id`     | Delete a simulation (only if PENDING)    |

**POST /api/v1/simulations**:
- Body: `SimulationConfig` (validated with Zod)
- Creates simulation record in DB
- Generates attendees and saves them
- Returns simulation with attendees
- Status starts as PENDING

**GET /api/v1/simulations**:
- Query params: `page`, `limit`, `status` (filter), `mode` (filter)
- Returns paginated list with basic info (no attendees)
- Sort by `createdAt` descending

**GET /api/v1/simulations/:id**:
- Returns full simulation with attendees
- If completed, includes results

**Results**:

| Method | Path                                   | Description                    |
|--------|----------------------------------------|--------------------------------|
| GET    | `/api/v1/simulations/:id/results`      | Get simulation results/stats   |
| GET    | `/api/v1/simulations/:id/dates`        | Get all dates from simulation  |

**GET /api/v1/simulations/:id/results**:
- Returns `SimulationResult` with all aggregated stats
- 404 if simulation hasn't completed

**GET /api/v1/simulations/:id/dates**:
- Returns all `SimulatedDate` records for the simulation
- Includes attendee names for display

### Middleware

- Input validation middleware using Zod schemas
- Error handling middleware with consistent error response format:
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "..." } }
  ```
- Request logging

### Quick Simulation Flow

When creating a simulation with `mode: QUICK`:
1. POST creates the simulation and attendees
2. The server immediately runs the simulation engine (no ticks)
3. Results are saved to DB
4. Response includes the simulation with results

This is different from DETAILED mode where the simulation only runs when triggered via Socket.io.

## Acceptance Criteria

- [ ] POST creates simulation and generates attendees
- [ ] GET list returns paginated simulations
- [ ] GET detail returns simulation with attendees and results (if complete)
- [ ] Quick mode simulations complete immediately on creation
- [ ] Invalid configs are rejected with clear error messages
- [ ] All inputs validated with Zod
- [ ] Error responses follow consistent format
