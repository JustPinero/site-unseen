import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EventHeader from "../event-header";
import type { SimulationTick } from "@site-unseen/shared";

const tick: SimulationTick = {
  eventClock: 75,
  currentRound: 3,
  roundPhase: "dating",
  activePairs: [],
  waitingAttendees: [],
  completedDates: 0,
  totalEarlyExits: 0,
};

describe("EventHeader", () => {
  it("displays formatted event clock", () => {
    render(<EventHeader tick={tick} connected={true} />);
    expect(screen.getByText("1:15")).toBeInTheDocument();
  });

  it("displays current round number", () => {
    render(<EventHeader tick={tick} connected={true} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows phase badge", () => {
    render(<EventHeader tick={tick} connected={true} />);
    expect(screen.getByText("Dating")).toBeInTheDocument();
  });

  it("shows Live when connected", () => {
    render(<EventHeader tick={tick} connected={true} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("shows Reconnecting when disconnected", () => {
    render(<EventHeader tick={tick} connected={false} />);
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();
  });
});
