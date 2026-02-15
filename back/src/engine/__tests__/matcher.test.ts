import { describe, it, expect } from "vitest";
import { areCompatible, matchRound, makePairKey, computeCompatibilityScore } from "../matcher.js";
import { Gender, Sexuality } from "@site-unseen/shared";
import type { Attendee } from "@site-unseen/shared";

function makeAttendee(overrides: Partial<Attendee> = {}): Attendee {
  return {
    id: crypto.randomUUID(),
    simulationId: "sim-1",
    name: "Test A.",
    gender: Gender.MALE,
    sexuality: Sexuality.HETEROSEXUAL,
    age: 30,
    ethnicity: "White",
    interests: ["Hiking"],
    ...overrides,
  };
}

describe("areCompatible", () => {
  it("hetero man + hetero woman = compatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL });
    const b = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL });
    expect(areCompatible(a, b)).toBe(true);
  });

  it("hetero man + hetero man = incompatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL });
    const b = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL });
    expect(areCompatible(a, b)).toBe(false);
  });

  it("homo man + homo man = compatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HOMOSEXUAL });
    const b = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HOMOSEXUAL });
    expect(areCompatible(a, b)).toBe(true);
  });

  it("homo man + homo woman = incompatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HOMOSEXUAL });
    const b = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HOMOSEXUAL });
    expect(areCompatible(a, b)).toBe(false);
  });

  it("bi man + hetero woman = compatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.BISEXUAL });
    const b = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL });
    expect(areCompatible(a, b)).toBe(true);
  });

  it("bi man + homo man = compatible", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.BISEXUAL });
    const b = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HOMOSEXUAL });
    expect(areCompatible(a, b)).toBe(true);
  });

  it("bi woman + bi woman = compatible", () => {
    const a = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.BISEXUAL });
    const b = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.BISEXUAL });
    expect(areCompatible(a, b)).toBe(true);
  });

  it("hetero man + homo woman = incompatible (not mutual)", () => {
    const a = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL });
    const b = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HOMOSEXUAL });
    expect(areCompatible(a, b)).toBe(false);
  });
});

describe("matchRound", () => {
  it("pairs compatible attendees", () => {
    const attendees = [
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL }),
    ];
    const result = matchRound(attendees, new Set());
    expect(result.pairs).toHaveLength(1);
    expect(result.unmatched).toHaveLength(0);
  });

  it("leaves incompatible attendees unmatched", () => {
    const attendees = [
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
    ];
    const result = matchRound(attendees, new Set());
    expect(result.pairs).toHaveLength(0);
    expect(result.unmatched).toHaveLength(2);
  });

  it("never produces repeat pairings", () => {
    const m = makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL });
    const f = makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL });
    const previousPairs = new Set([makePairKey(m.id, f.id)]);
    const result = matchRound([m, f], previousPairs);
    expect(result.pairs).toHaveLength(0);
    expect(result.unmatched).toHaveLength(2);
  });

  it("handles odd number of compatible attendees", () => {
    const attendees = [
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL }),
    ];
    const result = matchRound(attendees, new Set());
    expect(result.pairs).toHaveLength(1);
    expect(result.unmatched).toHaveLength(1);
  });

  it("matches multiple pairs in a round", () => {
    const attendees = [
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL }),
      makeAttendee({ gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL }),
    ];
    const result = matchRound(attendees, new Set());
    expect(result.pairs).toHaveLength(2);
    expect(result.unmatched).toHaveLength(0);
  });
});

describe("makePairKey", () => {
  it("produces the same key regardless of argument order", () => {
    expect(makePairKey("aaa", "zzz")).toBe(makePairKey("zzz", "aaa"));
  });
});

describe("computeCompatibilityScore", () => {
  it("returns a score between 0 and 100", () => {
    const a = makeAttendee({ interests: ["Hiking", "Cooking"], age: 30 });
    const b = makeAttendee({ interests: ["Hiking", "Gaming"], age: 32 });
    for (let i = 0; i < 100; i++) {
      const score = computeCompatibilityScore(a, b);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("gives age proximity bonus for close ages", () => {
    const a = makeAttendee({ interests: [], age: 30 });
    const bClose = makeAttendee({ interests: [], age: 32 });
    const bFar = makeAttendee({ interests: [], age: 50 });

    // Run many times and compare averages
    let sumClose = 0;
    let sumFar = 0;
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      sumClose += computeCompatibilityScore(a, bClose);
      sumFar += computeCompatibilityScore(a, bFar);
    }
    expect(sumClose / iterations).toBeGreaterThan(sumFar / iterations);
  });

  it("gives interest overlap bonus", () => {
    const a = makeAttendee({ interests: ["Hiking", "Cooking", "Reading"], age: 30 });
    const bOverlap = makeAttendee({ interests: ["Hiking", "Cooking", "Reading"], age: 30 });
    const bNoOverlap = makeAttendee({ interests: ["Gaming", "Sports", "Cycling"], age: 30 });

    let sumOverlap = 0;
    let sumNoOverlap = 0;
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      sumOverlap += computeCompatibilityScore(a, bOverlap);
      sumNoOverlap += computeCompatibilityScore(a, bNoOverlap);
    }
    expect(sumOverlap / iterations).toBeGreaterThan(sumNoOverlap / iterations);
  });
});
