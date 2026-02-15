import { describe, it, expect } from "vitest";
import { simulationConfigSchema } from "../index.js";
import { SimulationMode } from "../../types/index.js";

const validConfig = {
  name: "Test Sim",
  mode: SimulationMode.DETAILED,
  eventLengthMinutes: 60,
  dateLengthMinutes: 5,
  breakLengthMinutes: 1,
  attendeeCount: 20,
};

describe("simulationConfigSchema", () => {
  it("accepts a valid config", () => {
    const result = simulationConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("accepts QUICK mode", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      mode: SimulationMode.QUICK,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 characters", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mode", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      mode: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = simulationConfigSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects eventLengthMinutes below 15", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      eventLengthMinutes: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects eventLengthMinutes above 180", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      eventLengthMinutes: 200,
    });
    expect(result.success).toBe(false);
  });

  it("rejects attendeeCount below 4", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      attendeeCount: 2,
    });
    expect(result.success).toBe(false);
  });

  it("rejects attendeeCount above 100", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      attendeeCount: 200,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer values", () => {
    const result = simulationConfigSchema.safeParse({
      ...validConfig,
      dateLengthMinutes: 5.5,
    });
    expect(result.success).toBe(false);
  });
});
