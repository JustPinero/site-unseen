# Request #007 — Frontend: Real-Time Simulation View

**Status**: Not Started
**Dependencies**: Request #004 (WebSocket Layer), Request #006 (Frontend Setup UI)

## Description

Build the detailed simulation view — the flagship feature. This page shows a live table of all currently matched pairs with their date progress, a sidebar of waiting attendees, and an event clock. All state comes from server ticks via Socket.io. Zero client-side timers.

## Requirements

### SimulationViewPage (`front/src/pages/SimulationViewPage.tsx`)

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Event Clock: 12:00 / 60:00    Round 3/12   │
│  ◼ Dating Phase                              │
├──────────────────────────┬──────────────────┤
│                          │                  │
│   ACTIVE DATES TABLE     │   WAITING LIST   │
│                          │                  │
│  Person A │ Person B     │   - Name (age)   │
│  ──────── │ ────────     │   - Name (age)   │
│  Name     │ Name         │   - Name (age)   │
│  3:00/5:00│              │                  │
│  ████░░   │              │                  │
│           │              │                  │
│  Name     │ Name         │                  │
│  2:00/5:00│              │                  │
│  ███░░░   │              │                  │
│           │              │                  │
├──────────────────────────┴──────────────────┤
│  Stats Bar: 8 dates completed │ 2 early exits│
└─────────────────────────────────────────────┘
```

**Components**:

- `EventHeader` — shows event clock, current round, round phase (matching/dating/break)
- `ActiveDatesTable` — table of all current pairs:
  - Attendee A name, age, gender icon
  - Attendee B name, age, gender icon
  - Progress bar showing date elapsed vs date length
  - "Ended Early" badge if applicable
  - Subtle heart animation between paired names
- `WaitingList` — sidebar of attendees not in a date this round
  - Show name, age, gender icon
  - Muted styling (they're sitting out)
- `StatsBar` — bottom bar with running totals: dates completed, early exits, attendees dated

**Socket.io Integration**:
- Use `useSimulation(id)` hook from Request #004
- On mount: join room, receive state
- On each `simulation:tick`: update all components
- On `simulation:completed`: navigate to results page
- On disconnect/reconnect: re-join room seamlessly

**Visual Polish**:
- Progress bars animate smoothly between ticks (CSS transition over 1 second)
- When a date ends early, flash a "broken heart" indicator briefly
- When a new round starts, animate the table shuffle
- Valentine's color scheme: pink progress bars, red accents, heart decorations

### Connection Status
- Show a connection indicator (connected/reconnecting)
- If disconnected, overlay message: "Reconnecting..." with spinner
- On reconnect, state resumes seamlessly (server sends snapshot)

## Acceptance Criteria

- [ ] Page connects to simulation room via Socket.io on mount
- [ ] Active dates table updates every tick (1 second)
- [ ] Progress bars show correct elapsed/total time
- [ ] Waiting list shows correct attendees per round
- [ ] Event clock and round counter update correctly
- [ ] Early exits are visually indicated
- [ ] Late-joining viewers see current state immediately
- [ ] On simulation complete, redirects to results
- [ ] No client-side timers — all state from server
- [ ] Reconnection works without losing sync
