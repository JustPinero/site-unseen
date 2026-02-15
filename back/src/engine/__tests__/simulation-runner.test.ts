import { describe, it, expect } from "vitest";
import { SimulationRunner } from "../simulation-runner.js";
import { generateAttendees } from "../attendee-generator.js";
import { SimulationMode } from "@site-unseen/shared";
import type { SimulationConfig } from "@site-unseen/shared";

function makeConfig(overrides: Partial<SimulationConfig> = {}): SimulationConfig {
  return {
    name: "Test Sim",
    mode: SimulationMode.QUICK,
    eventLengthMinutes: 60,
    dateLengthMinutes: 5,
    breakLengthMinutes: 1,
    attendeeCount: 20,
    ...overrides,
  };
}

describe("SimulationRunner — quick mode", () => {
  it("completes without errors", () => {
    const config = makeConfig();
    const attendees = generateAttendees({ simulationId: "sim-1", count: config.attendeeCount });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const dates = runner.runQuick();
    expect(runner.isFinished()).toBe(true);
    expect(dates.length).toBeGreaterThan(0);
  });

  it("produces dates with valid fields", () => {
    const config = makeConfig();
    const attendees = generateAttendees({ simulationId: "sim-1", count: config.attendeeCount });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const dates = runner.runQuick();
    for (const d of dates) {
      expect(d.simulationId).toBe("sim-1");
      expect(d.roundNumber).toBeGreaterThanOrEqual(1);
      expect(d.durationMinutes).toBeGreaterThanOrEqual(1);
      expect(d.durationMinutes).toBeLessThanOrEqual(config.dateLengthMinutes);
      expect(d.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(d.compatibilityScore).toBeLessThanOrEqual(100);
    }
  });

  it("never repeats a pairing", () => {
    const config = makeConfig({ attendeeCount: 10, eventLengthMinutes: 180 });
    const attendees = generateAttendees({ simulationId: "sim-1", count: config.attendeeCount });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const dates = runner.runQuick();
    const pairKeys = new Set<string>();
    for (const d of dates) {
      const key = [d.attendeeAId, d.attendeeBId].sort().join(":");
      expect(pairKeys.has(key)).toBe(false);
      pairKeys.add(key);
    }
  });

  it("handles small group (4 attendees)", () => {
    const config = makeConfig({ attendeeCount: 4 });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 4 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const dates = runner.runQuick();
    expect(runner.isFinished()).toBe(true);
    // May have 0 dates if demographics are incompatible, that's fine
    expect(dates.length).toBeGreaterThanOrEqual(0);
  });

  it("handles large group (100 attendees)", () => {
    const config = makeConfig({ attendeeCount: 100 });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 100 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const dates = runner.runQuick();
    expect(runner.isFinished()).toBe(true);
    expect(dates.length).toBeGreaterThan(0);
  });

  it("respects event length limit", () => {
    const config = makeConfig({ eventLengthMinutes: 15, dateLengthMinutes: 5, breakLengthMinutes: 1 });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 20 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    runner.runQuick();
    // Max rounds = floor(15 / (5 + 1)) = 2
    expect(runner.getCurrentRound()).toBeLessThanOrEqual(2);
  });
});

describe("SimulationRunner — detailed mode (tick)", () => {
  it("tick() advances the event clock by 1 each call", () => {
    const config = makeConfig({ mode: SimulationMode.DETAILED });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 10 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const tick1 = runner.tick();
    expect(tick1.eventClock).toBe(1);

    const tick2 = runner.tick();
    expect(tick2.eventClock).toBe(2);
  });

  it("tick() returns valid SimulationTick structure", () => {
    const config = makeConfig({ mode: SimulationMode.DETAILED });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 10 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    const tick = runner.tick();
    expect(tick).toHaveProperty("eventClock");
    expect(tick).toHaveProperty("currentRound");
    expect(tick).toHaveProperty("roundPhase");
    expect(tick).toHaveProperty("activePairs");
    expect(tick).toHaveProperty("waitingAttendees");
    expect(tick).toHaveProperty("completedDates");
    expect(tick).toHaveProperty("totalEarlyExits");
    expect(["matching", "dating", "break"]).toContain(tick.roundPhase);
  });

  it("eventually finishes when ticked repeatedly", () => {
    const config = makeConfig({
      mode: SimulationMode.DETAILED,
      eventLengthMinutes: 15,
      dateLengthMinutes: 2,
      breakLengthMinutes: 1,
    });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 6 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    let ticks = 0;
    while (!runner.isFinished() && ticks < 500) {
      runner.tick();
      ticks++;
    }
    expect(runner.isFinished()).toBe(true);
  });

  it("active pairs have valid snapshots", () => {
    const config = makeConfig({ mode: SimulationMode.DETAILED, dateLengthMinutes: 3 });
    const attendees = generateAttendees({ simulationId: "sim-1", count: 10 });
    const runner = new SimulationRunner("sim-1", config, attendees);

    // Tick past matching into dating
    let tick = runner.tick(); // matching -> starts round
    tick = runner.tick(); // first minute of dating

    if (tick.activePairs.length > 0) {
      const pair = tick.activePairs[0]!;
      expect(pair.attendeeA).toHaveProperty("id");
      expect(pair.attendeeA).toHaveProperty("name");
      expect(pair.attendeeA).toHaveProperty("gender");
      expect(pair.attendeeB).toHaveProperty("id");
      expect(pair.dateLengthMinutes).toBe(3);
    }
  });
});
