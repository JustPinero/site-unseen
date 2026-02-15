import { describe, it, expect } from "vitest";
import { aggregateResults } from "../results-aggregator.js";
import { SimulationRunner } from "../simulation-runner.js";
import { generateAttendees } from "../attendee-generator.js";
import { SimulationMode } from "@site-unseen/shared";
import type { SimulationConfig } from "@site-unseen/shared";

function runAndAggregate(config: SimulationConfig) {
  const attendees = generateAttendees({
    simulationId: "sim-1",
    count: config.attendeeCount,
  });
  const runner = new SimulationRunner("sim-1", config, attendees);
  const dates = runner.runQuick();

  const result = aggregateResults("sim-1", runner.getCurrentRound(), attendees, dates);
  return { result, attendees, dates };
}

describe("results-aggregator", () => {
  it("produces correct totals", () => {
    const { result, dates } = runAndAggregate({
      name: "Test",
      mode: SimulationMode.QUICK,
      eventLengthMinutes: 60,
      dateLengthMinutes: 5,
      breakLengthMinutes: 1,
      attendeeCount: 20,
    });

    expect(result.simulationId).toBe("sim-1");
    expect(result.totalDatesCompleted).toBe(dates.length);
    expect(result.totalEarlyExits).toBe(dates.filter((d) => d.endedEarly).length);
    expect(result.totalRounds).toBeGreaterThanOrEqual(1);
    expect(result.averageDatesPerAttendee).toBeGreaterThanOrEqual(0);
  });

  it("includes demographic breakdowns in resultData", () => {
    const { result } = runAndAggregate({
      name: "Test",
      mode: SimulationMode.QUICK,
      eventLengthMinutes: 60,
      dateLengthMinutes: 5,
      breakLengthMinutes: 1,
      attendeeCount: 30,
    });

    const data = result.resultData as Record<string, unknown>;
    expect(data).toHaveProperty("byGender");
    expect(data).toHaveProperty("bySexuality");
    expect(data).toHaveProperty("byEthnicity");
    expect(data).toHaveProperty("byAgeBracket");
    expect(data).toHaveProperty("attendeesWithZeroDates");
    expect(data).toHaveProperty("compatibilityDistribution");
  });

  it("compatibility distribution buckets sum to total dates", () => {
    const { result, dates } = runAndAggregate({
      name: "Test",
      mode: SimulationMode.QUICK,
      eventLengthMinutes: 60,
      dateLengthMinutes: 5,
      breakLengthMinutes: 1,
      attendeeCount: 20,
    });

    const dist = (result.resultData as Record<string, unknown>).compatibilityDistribution as Record<
      string,
      number
    >;
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    expect(total).toBe(dates.length);
  });

  it("handles zero dates gracefully", () => {
    const { result } = runAndAggregate({
      name: "Test",
      mode: SimulationMode.QUICK,
      eventLengthMinutes: 15,
      dateLengthMinutes: 5,
      breakLengthMinutes: 1,
      attendeeCount: 4,
    });

    // May have 0 dates if all same gender/sexuality
    expect(result.totalDatesCompleted).toBeGreaterThanOrEqual(0);
    expect(result.averageDatesPerAttendee).toBeGreaterThanOrEqual(0);
  });
});
