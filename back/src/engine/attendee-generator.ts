import { Gender, Sexuality } from "@site-unseen/shared";
import type { Attendee } from "@site-unseen/shared";
import { randomUUID } from "node:crypto";

const FIRST_NAMES_MALE = [
  "James", "John", "Robert", "Michael", "David", "William", "Richard",
  "Joseph", "Thomas", "Daniel", "Matthew", "Anthony", "Mark", "Steven",
  "Andrew", "Paul", "Joshua", "Kenneth", "Kevin", "Brian", "Tyler",
  "Brandon", "Aaron", "Jason", "Justin", "Ryan", "Jacob", "Nathan",
  "Patrick", "Sean", "Carlos", "Luis", "Marcus", "Derek", "Omar",
];

const FIRST_NAMES_FEMALE = [
  "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth",
  "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty",
  "Margaret", "Sandra", "Ashley", "Emily", "Donna", "Michelle", "Carol",
  "Amanda", "Melissa", "Stephanie", "Rebecca", "Laura", "Samantha",
  "Christine", "Brenda", "Nicole", "Natalie", "Jasmine", "Aisha", "Priya",
];

const LAST_INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ETHNICITIES = [
  "White", "Black", "Hispanic", "Asian", "Middle Eastern",
  "South Asian", "Mixed", "Pacific Islander", "Native American",
];

const INTERESTS = [
  "Hiking", "Cooking", "Reading", "Gaming", "Photography",
  "Yoga", "Travel", "Music", "Dancing", "Painting",
  "Fitness", "Movies", "Gardening", "Volunteering", "Sports",
  "Writing", "Cycling", "Board Games", "Wine Tasting", "Meditation",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function pickRandomInterests(): string[] {
  const count = randomInt(1, 5);
  return shuffle([...INTERESTS]).slice(0, count);
}

function generateName(gender: Gender): string {
  const names = gender === Gender.MALE ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  const firstName = randomItem(names);
  const lastInitial = randomItem([...LAST_INITIALS]);
  return `${firstName} ${lastInitial}.`;
}

function pickGender(maleRatio: number): Gender {
  return Math.random() < maleRatio ? Gender.MALE : Gender.FEMALE;
}

function pickSexuality(heteroRatio: number, homoRatio: number): Sexuality {
  const roll = Math.random();
  if (roll < heteroRatio) return Sexuality.HETEROSEXUAL;
  if (roll < heteroRatio + homoRatio) return Sexuality.HOMOSEXUAL;
  return Sexuality.BISEXUAL;
}

export interface GeneratorOptions {
  simulationId: string;
  count: number;
  maleRatio?: number;
  heteroRatio?: number;
  homoRatio?: number;
  minAge?: number;
  maxAge?: number;
}

export function generateAttendees(options: GeneratorOptions): Attendee[] {
  const {
    simulationId,
    count,
    maleRatio = 0.5,
    heteroRatio = 0.8,
    homoRatio = 0.1,
    minAge = 21,
    maxAge = 45,
  } = options;

  const attendees: Attendee[] = [];

  for (let i = 0; i < count; i++) {
    const gender = pickGender(maleRatio);
    attendees.push({
      id: randomUUID(),
      simulationId,
      name: generateName(gender),
      gender,
      sexuality: pickSexuality(heteroRatio, homoRatio),
      age: randomInt(minAge, maxAge),
      ethnicity: randomItem(ETHNICITIES),
      interests: pickRandomInterests(),
    });
  }

  return attendees;
}
