# Request #008 — Frontend: Results & Graphs

**Status**: Not Started
**Dependencies**: Request #005 (REST API), Request #006 (Frontend Setup UI)

## Description

Build the results page that displays after a simulation completes (both detailed and quick modes). Shows a variety of charts and statistics breaking down the event by demographics, date counts, and compatibility.

## Requirements

### ResultsPage (`front/src/pages/ResultsPage.tsx`)

**Data Source**:
- Fetch `SimulationResult` from `GET /api/v1/simulations/:id/results`
- Fetch dates from `GET /api/v1/simulations/:id/dates`
- Also receives results via Socket.io `simulation:completed` event if coming from live view

**Charts & Graphs** (use a charting library like Recharts or Chart.js):

1. **Event Overview Card**
   - Total rounds, total dates, total early exits
   - Average dates per attendee
   - Event duration

2. **Dates by Gender** — Bar chart
   - How many dates each gender had on average
   - Separate bars: Male, Female

3. **Dates by Sexuality** — Bar chart
   - Average dates per sexuality: Heterosexual, Homosexual, Bisexual

4. **Attendance by Demographics** — Pie charts
   - Gender distribution of attendees
   - Sexuality distribution of attendees
   - Ethnicity distribution of attendees

5. **Dates per Attendee Distribution** — Histogram
   - X-axis: number of dates (0, 1, 2, 3...)
   - Y-axis: number of attendees with that count
   - Highlights attendees with 0 dates

6. **Compatibility Score Distribution** — Histogram
   - Distribution of compatibility scores across all dates

7. **Age Distribution of Daters** — Bar chart
   - Dates by age bracket (21–25, 26–30, 31–35, etc.)

8. **Early Exit Rate** — Donut chart
   - Completed dates vs early exits
   - With percentage labels

### Layout
- Header: simulation name, mode badge, event config summary
- Grid of chart cards (responsive: 2 cols on desktop, 1 on mobile)
- Each chart card has a title, the chart, and a brief stat summary below
- Valentine's Day themed: pink/red/white color palette for charts

### Sharing
- Each results page has a shareable URL: `/simulations/:id/results`
- Anyone can view results of a completed simulation

## Acceptance Criteria

- [ ] Results page loads for completed simulations
- [ ] All 8 charts render with correct data
- [ ] Charts use Valentine's Day color palette
- [ ] Page is responsive (mobile-friendly)
- [ ] Results URL is directly shareable
- [ ] Quick mode simulations show results immediately after creation
- [ ] Detailed mode simulations show results after live view ends
- [ ] Loading states while fetching data
- [ ] 404/error state if simulation not found or not completed
