export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Sexuality {
  HETEROSEXUAL = "HETEROSEXUAL",
  HOMOSEXUAL = "HOMOSEXUAL",
  BISEXUAL = "BISEXUAL",
}

export enum SimulationStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
}

export enum SimulationMode {
  DETAILED = "DETAILED",
  QUICK = "QUICK",
}

export type RoundPhase = "matching" | "dating" | "break";

export interface Simulation {
  id: string;
  name: string;
  status: SimulationStatus;
  mode: SimulationMode;
  eventLengthMinutes: number;
  dateLengthMinutes: number;
  breakLengthMinutes: number;
  attendeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attendee {
  id: string;
  simulationId: string;
  name: string;
  gender: Gender;
  sexuality: Sexuality;
  age: number;
  ethnicity: string;
  interests: string[];
}

export interface SimulatedDate {
  id: string;
  simulationId: string;
  roundNumber: number;
  attendeeAId: string;
  attendeeBId: string;
  durationMinutes: number;
  endedEarly: boolean;
  compatibilityScore: number;
}

export interface SimulationResult {
  id: string;
  simulationId: string;
  totalRounds: number;
  totalDatesCompleted: number;
  totalEarlyExits: number;
  averageDatesPerAttendee: number;
  resultData: Record<string, unknown>;
}

export interface AttendeeSnapshot {
  id: string;
  name: string;
  gender: Gender;
  sexuality: Sexuality;
  age: number;
}

export interface ActivePair {
  attendeeA: AttendeeSnapshot;
  attendeeB: AttendeeSnapshot;
  dateMinutesElapsed: number;
  dateLengthMinutes: number;
  endedEarly: boolean;
}

export interface SimulationTick {
  eventClock: number;
  currentRound: number;
  roundPhase: RoundPhase;
  activePairs: ActivePair[];
  waitingAttendees: AttendeeSnapshot[];
  completedDates: number;
  totalEarlyExits: number;
}
