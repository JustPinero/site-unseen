# Request #009 — Browse & Live Lobby

**Status**: Not Started
**Dependencies**: Request #007 (Real-Time View), Request #008 (Results & Graphs)

## Description

Enhance the simulation list page with live status updates and a lobby feel. Users should see which simulations are currently running (with viewer counts), which are completed, and easily jump into any of them.

## Requirements

### Enhanced SimulationListPage

**Live Status via Socket.io**:
- Connect to a `/lobby` Socket.io namespace
- Server broadcasts updates when:
  - A new simulation is created
  - A simulation starts running
  - A simulation completes
  - Viewer count changes for any running simulation
- Cards update in real-time without page refresh

**Card Enhancements**:
- Running simulations show:
  - Pulsing "LIVE" badge
  - Current round / total rounds
  - Number of active viewers (eye icon + count)
  - "Watch Live" button
- Completed simulations show:
  - "View Results" button
  - Total dates completed, total attendees
- Pending simulations show:
  - "Waiting to Start" badge
  - "Start" button (if creator)

**Filtering & Sorting**:
- Filter tabs: All, Live, Completed
- Sort: Newest, Most Viewers, Most Attendees
- Search by simulation name

### Server-Side Lobby (`back/src/socket/lobby.ts`)

**Namespace**: `/lobby`

**Events — Server to Client**:
- `lobby:simulation-update` — emits when any simulation changes status
- `lobby:viewer-count` — emits viewer count changes for running simulations

**Events — Client to Server**:
- `lobby:subscribe` — start receiving lobby updates

**Data**:
- Track viewer count per running simulation (from simulation rooms)
- Broadcast changes to lobby subscribers

## Acceptance Criteria

- [ ] Simulation list updates in real-time when simulations are created/started/completed
- [ ] Running simulations show live viewer count
- [ ] Live badge pulses on running simulations
- [ ] Filter and sort work correctly
- [ ] Clicking a running simulation opens the live view
- [ ] Clicking a completed simulation opens results
- [ ] Lobby updates don't cause full page re-renders (efficient updates)
