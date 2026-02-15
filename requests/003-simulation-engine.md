# Request #003 — Simulation Engine (Core Logic)

**Status**: Not Started
**Dependencies**: Request #002 (Data Models)

## Description

Build the server-side simulation engine — the heart of the app. This is a pure logic module that takes a simulation config, generates attendees, runs the matching algorithm, progresses dates round by round, and produces results. It supports both tick-by-tick (detailed) and instant (quick) execution.

## Requirements

### Attendee Generation (`back/src/engine/attendee-generator.ts`)

- Generate N attendees based on simulation config
- Random name generation (first name + last initial)
- Gender distribution: configurable ratio (default 50/50)
- Sexuality distribution: configurable (default ~80% hetero, ~10% homo, ~10% bi)
- Age: random within configured range (default 21–45)
- Ethnicity: randomly assigned from a configured pool
- Interests: 1–5 randomly selected from a predefined pool of ~20 hobbies

### Matching Algorithm (`back/src/engine/matcher.ts`)

- Implement compatibility check per `reference/compatibility-rules.md`
- Each round: find all valid pairings from the available pool
- Randomize pairing selection (not deterministic)
- Enforce no-repeat-date rule
- Return matched pairs and unmatched attendees

### Simulation Runner (`back/src/engine/simulation-runner.ts`)

- Accepts a `SimulationConfig` and list of generated `Attendee` records
- Runs the event loop per `reference/event-rules.md`:
  1. Start event clock at 0
  2. Each round: match, run dates, handle early exits, break
  3. Advance clock by date length + break length per round
  4. Stop when event time runs out or all pairings exhausted
- **Detailed mode**: Exposes a `tick()` method that advances 1 simulation minute and returns a `SimulationTick` state object. The caller (Socket.io handler) calls this every 1 second.
- **Quick mode**: Runs the entire event loop synchronously and returns full results.
- Early exit: 15% chance per simulated minute per pair
- Compatibility scoring after each date (per compatibility-rules.md)

### Results Aggregation (`back/src/engine/results-aggregator.ts`)

- After simulation completes, compute:
  - Total rounds run
  - Total dates completed
  - Total early exits
  - Average dates per attendee
  - Dates per demographic group (by gender, sexuality, ethnicity, age bracket)
  - Attendees who had 0 dates
  - Distribution of compatibility scores
- Package into `SimulationResult` for database storage

## Acceptance Criteria

- [ ] Attendee generator produces valid attendees respecting configured distributions
- [ ] Matcher correctly identifies valid pairs per compatibility rules
- [ ] Matcher never produces repeat pairings
- [ ] Simulation runner completes without errors for various configs (small, large, skewed demographics)
- [ ] Detailed mode `tick()` returns correct state each step
- [ ] Quick mode returns complete results instantly
- [ ] Early exit probability works correctly
- [ ] Results aggregator produces accurate statistics
- [ ] All engine code has unit tests
