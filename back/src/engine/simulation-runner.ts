import type {
  Attendee,
  AttendeeSnapshot,
  SimulationTick,
  SimulationConfig,
  SimulatedDate,
} from "@site-unseen/shared";
import { matchRound, makePairKey, computeCompatibilityScore } from "./matcher.js";

const EARLY_EXIT_CHANCE_PER_MINUTE = 0.15;

interface ActiveDate {
  attendeeA: Attendee;
  attendeeB: Attendee;
  minutesElapsed: number;
  endedEarly: boolean;
}

export interface SimulationState {
  eventClock: number;
  currentRound: number;
  roundPhase: "matching" | "dating" | "break";
  activeDates: ActiveDate[];
  waitingAttendees: Attendee[];
  completedDates: SimulatedDate[];
  totalEarlyExits: number;
  breakMinuteCounter: number;
  finished: boolean;
}

function toSnapshot(a: Attendee): AttendeeSnapshot {
  return {
    id: a.id,
    name: a.name,
    gender: a.gender,
    sexuality: a.sexuality,
    age: a.age,
  };
}

export class SimulationRunner {
  private readonly config: SimulationConfig;
  private readonly simulationId: string;
  private readonly attendees: Attendee[];
  private readonly dateLengthMinutes: number;
  private readonly breakLengthMinutes: number;
  private readonly maxRounds: number;
  private readonly previousPairs = new Set<string>();

  private state: SimulationState;

  constructor(
    simulationId: string,
    config: SimulationConfig,
    attendees: Attendee[],
  ) {
    this.simulationId = simulationId;
    this.config = config;
    this.attendees = attendees;
    this.dateLengthMinutes = config.dateLengthMinutes;
    this.breakLengthMinutes = config.breakLengthMinutes;
    const roundLength = this.dateLengthMinutes + this.breakLengthMinutes;
    this.maxRounds = Math.floor(config.eventLengthMinutes / roundLength);

    this.state = {
      eventClock: 0,
      currentRound: 0,
      roundPhase: "matching",
      activeDates: [],
      waitingAttendees: [],
      completedDates: [],
      totalEarlyExits: 0,
      breakMinuteCounter: 0,
      finished: false,
    };
  }

  /** Advance by 1 simulation minute. Returns the tick state. */
  tick(): SimulationTick {
    if (this.state.finished) {
      return this.toTick();
    }

    this.state.eventClock++;

    if (this.state.roundPhase === "matching") {
      this.startNewRound();
    } else if (this.state.roundPhase === "dating") {
      this.advanceDates();
    } else if (this.state.roundPhase === "break") {
      this.advanceBreak();
    }

    return this.toTick();
  }

  /** Run entire simulation synchronously. Returns all completed dates. */
  runQuick(): SimulatedDate[] {
    while (!this.state.finished) {
      this.tick();
    }
    return this.state.completedDates;
  }

  isFinished(): boolean {
    return this.state.finished;
  }

  getCompletedDates(): SimulatedDate[] {
    return this.state.completedDates;
  }

  getCurrentRound(): number {
    return this.state.currentRound;
  }

  private startNewRound(): void {
    this.state.currentRound++;

    if (this.state.currentRound > this.maxRounds) {
      this.state.finished = true;
      return;
    }

    const { pairs, unmatched } = matchRound(this.attendees, this.previousPairs);

    if (pairs.length === 0) {
      this.state.finished = true;
      return;
    }

    for (const [a, b] of pairs) {
      this.previousPairs.add(makePairKey(a.id, b.id));
    }

    this.state.activeDates = pairs.map(([a, b]) => ({
      attendeeA: a,
      attendeeB: b,
      minutesElapsed: 0,
      endedEarly: false,
    }));
    this.state.waitingAttendees = unmatched;
    this.state.roundPhase = "dating";
  }

  private advanceDates(): void {
    const stillActive: ActiveDate[] = [];

    for (const date of this.state.activeDates) {
      if (date.endedEarly) continue;

      date.minutesElapsed++;

      // Early exit check: 15% chance per minute
      if (
        date.minutesElapsed < this.dateLengthMinutes &&
        Math.random() < EARLY_EXIT_CHANCE_PER_MINUTE
      ) {
        date.endedEarly = true;
        this.state.totalEarlyExits++;
        this.recordDate(date);
        continue;
      }

      if (date.minutesElapsed >= this.dateLengthMinutes) {
        this.recordDate(date);
        continue;
      }

      stillActive.push(date);
    }

    this.state.activeDates = stillActive;

    // All dates in this round are done
    if (this.state.activeDates.length === 0) {
      if (this.breakLengthMinutes > 0) {
        this.state.roundPhase = "break";
        this.state.breakMinuteCounter = 0;
      } else {
        this.checkEndOrNextRound();
      }
    }
  }

  private advanceBreak(): void {
    this.state.breakMinuteCounter++;

    if (this.state.breakMinuteCounter >= this.breakLengthMinutes) {
      this.checkEndOrNextRound();
    }
  }

  private checkEndOrNextRound(): void {
    // Check if event time has been exceeded
    const nextRoundTime =
      this.state.eventClock + this.dateLengthMinutes + this.breakLengthMinutes;
    if (nextRoundTime > this.config.eventLengthMinutes) {
      this.state.finished = true;
      return;
    }

    // Check if any new pairings are possible
    const testMatch = matchRound(this.attendees, this.previousPairs);
    if (testMatch.pairs.length === 0) {
      this.state.finished = true;
      return;
    }

    this.state.roundPhase = "matching";
  }

  private recordDate(date: ActiveDate): void {
    const score = computeCompatibilityScore(date.attendeeA, date.attendeeB);

    this.state.completedDates.push({
      id: crypto.randomUUID(),
      simulationId: this.simulationId,
      roundNumber: this.state.currentRound,
      attendeeAId: date.attendeeA.id,
      attendeeBId: date.attendeeB.id,
      durationMinutes: date.minutesElapsed,
      endedEarly: date.endedEarly,
      compatibilityScore: score,
    });
  }

  private toTick(): SimulationTick {
    return {
      eventClock: this.state.eventClock,
      currentRound: this.state.currentRound,
      roundPhase: this.state.roundPhase,
      activePairs: this.state.activeDates.map((d) => ({
        attendeeA: toSnapshot(d.attendeeA),
        attendeeB: toSnapshot(d.attendeeB),
        dateMinutesElapsed: d.minutesElapsed,
        dateLengthMinutes: this.dateLengthMinutes,
        endedEarly: d.endedEarly,
      })),
      waitingAttendees: this.state.waitingAttendees.map(toSnapshot),
      completedDates: this.state.completedDates.length,
      totalEarlyExits: this.state.totalEarlyExits,
    };
  }
}
