# Request #004 — WebSocket Layer (Socket.io)

**Status**: Not Started
**Dependencies**: Request #003 (Simulation Engine)

## Description

Implement the Socket.io server and client integration that powers real-time simulation viewing. The server is authoritative — it runs the simulation clock and pushes state. Clients only render. This is the critical layer that prevents the sync issues from previous versions.

## Requirements

### Server-Side Socket.io (`back/src/socket/`)

**Namespace**: `/simulation`

**Room Management**:
- Each simulation gets its own Socket.io room: `sim:{simulationId}`
- When a client connects and requests a simulation, join them to that room
- Track active viewers per simulation

**Events — Server to Client**:
- `simulation:tick` — emits `SimulationTick` state every 1 second during detailed mode
- `simulation:started` — emits when a simulation begins
- `simulation:completed` — emits final `SimulationResult` when done
- `simulation:error` — emits if simulation encounters an error

**Events — Client to Server**:
- `simulation:join` — client requests to join a simulation room (sends `simulationId`)
- `simulation:leave` — client leaves a simulation room
- `simulation:start` — creator starts the simulation (triggers engine)

**Join Anytime (State Snapshot)**:
- When a client joins an in-progress simulation, immediately emit the current `SimulationTick` state so they catch up
- Then they receive normal ticks going forward
- If the simulation is completed, immediately emit the `SimulationResult`

**Tick Loop**:
- When a detailed simulation starts, create a `setInterval(1000)` that:
  1. Calls `simulationRunner.tick()`
  2. Broadcasts the returned `SimulationTick` to the room
  3. If the simulation completes, clear the interval and emit results
- Store active simulation runners in memory (Map keyed by simulationId)

### Client-Side Socket.io (`front/src/socket/`)

**Connection**:
- Connect to `/simulation` namespace on mount
- Auto-reconnect with exponential backoff
- On reconnect, re-join the current simulation room

**Hooks** (`front/src/hooks/`):
- `useSimulation(simulationId)` — joins room, listens for ticks, returns current state
- Handles: connecting, tick updates, completion, errors, reconnection
- Cleans up listeners on unmount

**State Management**:
- Client holds ONLY the latest `SimulationTick` in state
- NO client-side timers or clocks — the server tick IS the clock
- On `simulation:completed`, store the `SimulationResult` in state

## Architecture Notes

```
Creator clicks "Start Simulation"
  → Client emits simulation:start { simulationId }
  → Server creates SimulationRunner, starts tick interval
  → Server emits simulation:started to room

Every 1 second:
  → Server calls runner.tick()
  → Server emits simulation:tick { SimulationTick } to room
  → All clients in room update their state and re-render

Viewer joins mid-simulation:
  → Client emits simulation:join { simulationId }
  → Server adds client to room
  → Server immediately emits current SimulationTick
  → Client renders current state, then receives normal ticks

Simulation ends:
  → Server emits simulation:completed { SimulationResult }
  → Server clears interval
  → Server saves results to database
  → Clients show results view
```

## Acceptance Criteria

- [ ] Socket.io server starts alongside Express
- [ ] Clients can join simulation rooms
- [ ] Detailed mode broadcasts ticks every 1 second
- [ ] Late-joining viewers receive a state snapshot and sync immediately
- [ ] Multiple clients viewing the same simulation stay perfectly in sync
- [ ] Simulation completion is broadcast and results are saved
- [ ] Client reconnection re-joins the room without missing state
- [ ] No client-side timers exist — server is sole clock source
