# Request #006 — Frontend: Simulation Setup UI

**Status**: Not Started
**Dependencies**: Request #001 (Project Scaffolding), Request #005 (REST API)

## Description

Build the frontend pages for creating and configuring simulations, and browsing existing simulations. This is the entry point of the app — where users set up their speed dating event before watching it unfold.

## Requirements

### Pages & Routing

| Route                    | Component              | Description                       |
|--------------------------|------------------------|-----------------------------------|
| `/`                      | `HomePage`             | Landing page with hero + nav      |
| `/create`                | `CreateSimulationPage` | Configuration form                |
| `/simulations`           | `SimulationListPage`   | Browse all simulations            |
| `/simulations/:id`       | `SimulationViewPage`   | View a specific simulation        |
| `/simulations/:id/results` | `ResultsPage`       | View results (quick or post-sim)  |

### HomePage
- Valentine's Day themed hero section
- "Create Simulation" CTA button
- "Browse Simulations" secondary button
- Brief explanation of what the app does

### CreateSimulationPage
- Form fields:
  - **Simulation Name** — text input
  - **Mode** — toggle/radio: Detailed (Real-Time) vs Quick
  - **Event Length** — slider or number input (15–180 minutes)
  - **Date Length** — slider or number input (2–15 minutes)
  - **Break Length** — slider or number input (0–5 minutes)
  - **Attendee Count** — slider or number input (4–100)
- Optional advanced settings (expandable):
  - Gender ratio slider
  - Sexuality distribution sliders
  - Age range
- "Start Simulation" button
  - Quick mode: POST to API, redirect to results page
  - Detailed mode: POST to API, redirect to simulation view page

### SimulationListPage
- Card grid of all simulations
- Each card shows: name, mode, attendee count, status, created date
- Status badges: Pending (yellow), Running (green pulse), Completed (blue)
- Click card to view (detailed view if running, results if completed)
- Filter by status and mode
- Pagination

### API Integration (`front/src/api/`)
- API client module using fetch
- Functions: `createSimulation()`, `listSimulations()`, `getSimulation()`, `getResults()`
- Type-safe with shared types
- Error handling with user-friendly messages

## Acceptance Criteria

- [ ] Home page loads with Valentine's Day styling
- [ ] Create form validates inputs before submission
- [ ] Simulation is created via API on submit
- [ ] Quick mode redirects to results after creation
- [ ] Detailed mode redirects to simulation view
- [ ] Simulation list loads and displays all simulations
- [ ] Cards show correct status and link to appropriate view
- [ ] All pages are responsive
