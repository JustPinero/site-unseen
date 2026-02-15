import { describe, it, expect } from "vitest";
import { generateAttendees } from "../attendee-generator.js";
import { Gender, Sexuality } from "@site-unseen/shared";

describe("attendee-generator", () => {
  it("generates the correct number of attendees", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 20 });
    expect(attendees).toHaveLength(20);
  });

  it("assigns the simulationId to all attendees", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 10 });
    for (const a of attendees) {
      expect(a.simulationId).toBe("sim-1");
    }
  });

  it("generates unique IDs", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 50 });
    const ids = new Set(attendees.map((a) => a.id));
    expect(ids.size).toBe(50);
  });

  it("assigns valid gender values", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 50 });
    for (const a of attendees) {
      expect([Gender.MALE, Gender.FEMALE]).toContain(a.gender);
    }
  });

  it("assigns valid sexuality values", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 50 });
    for (const a of attendees) {
      expect([Sexuality.HETEROSEXUAL, Sexuality.HOMOSEXUAL, Sexuality.BISEXUAL]).toContain(
        a.sexuality,
      );
    }
  });

  it("generates names in 'First L.' format", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 20 });
    for (const a of attendees) {
      expect(a.name).toMatch(/^[A-Z][a-z]+ [A-Z]\.$/);
    }
  });

  it("assigns ages within default range", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 50 });
    for (const a of attendees) {
      expect(a.age).toBeGreaterThanOrEqual(21);
      expect(a.age).toBeLessThanOrEqual(45);
    }
  });

  it("respects custom age range", () => {
    const attendees = generateAttendees({
      simulationId: "sim-1",
      count: 50,
      minAge: 30,
      maxAge: 35,
    });
    for (const a of attendees) {
      expect(a.age).toBeGreaterThanOrEqual(30);
      expect(a.age).toBeLessThanOrEqual(35);
    }
  });

  it("assigns 1–5 interests to each attendee", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 50 });
    for (const a of attendees) {
      expect(a.interests.length).toBeGreaterThanOrEqual(1);
      expect(a.interests.length).toBeLessThanOrEqual(5);
    }
  });

  it("assigns non-empty ethnicity", () => {
    const attendees = generateAttendees({ simulationId: "sim-1", count: 20 });
    for (const a of attendees) {
      expect(a.ethnicity.length).toBeGreaterThan(0);
    }
  });

  it("respects gender ratio when heavily skewed", () => {
    const attendees = generateAttendees({
      simulationId: "sim-1",
      count: 100,
      maleRatio: 1.0,
    });
    for (const a of attendees) {
      expect(a.gender).toBe(Gender.MALE);
    }
  });
});
