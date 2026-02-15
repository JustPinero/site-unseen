# Event Rules — Speed Dating Simulation

## Event Configuration (User-Settable)

| Parameter              | Default | Min  | Max   | Description                                      |
|------------------------|---------|------|-------|--------------------------------------------------|
| **Event Length**        | 60 min  | 15   | 180   | Total duration of the event in simulation minutes |
| **Date Length**         | 5 min   | 2    | 15    | Maximum duration of each individual date          |
| **Attendee Count**     | 20      | 4    | 100   | Total number of simulated attendees               |
| **Break Between Dates**| 1 min   | 0    | 5     | Transition time between date rounds               |

## Event Flow

### 1. Setup Phase
- Attendees are generated based on configured demographic distribution.
- The matching pool is established.
- Event clock starts at 0:00.

### 2. Dating Rounds
Each round follows this sequence:

1. **Matching** — Compatible, un-paired attendees are randomly matched for this round.
2. **Date begins** — All matched pairs start their date simultaneously.
3. **Date progresses** — Timer counts from 0 to Date Length.
4. **Early exit possible** — Either party may end the date early (random chance, 15% per minute).
5. **Date ends** — When timer reaches Date Length or early exit triggers.
6. **Break** — Transition period before next round.
7. **Repeat** — Until event time runs out.

### 3. Early Exit Rules
- Each simulated minute, there is a **15% chance** either party ends the date early.
- The early exit check is per-pair, not per-person.
- If a date ends early, both attendees return to the available pool for the next round (they do NOT get re-matched mid-round).
- Early exits are tracked for analytics.

### 4. Event Completion
The event ends when:
- The event clock reaches the configured Event Length, OR
- All possible unique pairings have been exhausted (everyone has dated everyone compatible).

Dates in progress when the event clock expires are allowed to finish their current date.

## Simulation Timing

### Detailed (Real-Time) Mode
- **1 simulation minute = 1 real second**
- A 60-minute event plays out in ~60 seconds.
- The server ticks every 1 second and broadcasts state to all connected clients.
- Viewers see: current round, all active pairs, time remaining per date, event clock.

### Quick Mode
- The entire simulation runs server-side in one pass (milliseconds).
- No tick-by-tick broadcasting.
- Only the final results and statistics are returned to the client.

## Round Mechanics

- All matches within a round are determined simultaneously at round start.
- Attendees not matched in a round sit out entirely for that round.
- A new round cannot begin until all dates in the current round complete (or exit early) AND the break period elapses.
- The number of possible rounds = Event Length / (Date Length + Break Between Dates), rounded down.

## State Broadcast (Detailed Mode)

Every server tick (1 second), the following state is emitted:

```typescript
interface SimulationTick {
  eventClock: number;           // current simulation minute
  currentRound: number;         // which dating round
  roundPhase: 'matching' | 'dating' | 'break';
  activePairs: {
    attendeeA: AttendeeSnapshot;
    attendeeB: AttendeeSnapshot;
    dateMinutesElapsed: number;
    dateLengthMinutes: number;
    endedEarly: boolean;
  }[];
  waitingAttendees: AttendeeSnapshot[];
  completedDates: number;       // total dates finished so far
  totalEarlyExits: number;
}
```

## Edge Cases

- **Odd number of compatible attendees**: One person sits out each round (rotates).
- **Very small pools**: If only 2 compatible people exist, they date once and then both sit out remaining rounds.
- **All dates exhausted early**: Event ends when no new unique pairings can be made, even if time remains.
