import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsBar from "../stats-bar";
import type { SimulationTick } from "@site-unseen/shared";

const tick: SimulationTick = {
  eventClock: 15,
  currentRound: 2,
  roundPhase: "dating",
  activePairs: [
    {
      attendeeA: { id: "1", name: "Alice", gender: "FEMALE" as never, sexuality: "HETEROSEXUAL" as never, age: 25 },
      attendeeB: { id: "2", name: "Bob", gender: "MALE" as never, sexuality: "HETEROSEXUAL" as never, age: 28 },
      dateMinutesElapsed: 3,
      dateLengthMinutes: 5,
      endedEarly: false,
    },
  ],
  waitingAttendees: [
    { id: "3", name: "Charlie", gender: "MALE" as never, sexuality: "HETEROSEXUAL" as never, age: 30 },
  ],
  completedDates: 4,
  totalEarlyExits: 1,
};

describe("StatsBar", () => {
  it("renders completed dates count", () => {
    render(<StatsBar tick={tick} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Dates Completed")).toBeInTheDocument();
  });

  it("renders early exits count", () => {
    render(<StatsBar tick={tick} />);
    expect(screen.getByText("Early Exits")).toBeInTheDocument();
    // Value "1" appears multiple times (early exits, active, waiting), so check all exist
    expect(screen.getAllByText("1")).toHaveLength(3);
  });

  it("renders active pairs and waiting counts", () => {
    render(<StatsBar tick={tick} />);
    expect(screen.getByText("Active Now")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
  });
});
