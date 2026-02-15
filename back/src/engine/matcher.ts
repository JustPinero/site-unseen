import { Gender, Sexuality } from "@site-unseen/shared";
import type { Attendee } from "@site-unseen/shared";

export interface MatchResult {
  pairs: [Attendee, Attendee][];
  unmatched: Attendee[];
}

export function areCompatible(a: Attendee, b: Attendee): boolean {
  return canBeAttractedTo(a, b) && canBeAttractedTo(b, a);
}

function canBeAttractedTo(from: Attendee, to: Attendee): boolean {
  switch (from.sexuality) {
    case Sexuality.HETEROSEXUAL:
      return to.gender !== from.gender;
    case Sexuality.HOMOSEXUAL:
      return to.gender === from.gender;
    case Sexuality.BISEXUAL:
      return true;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function matchRound(
  available: Attendee[],
  previousPairs: Set<string>,
): MatchResult {
  const shuffled = shuffle(available);
  const matched = new Set<string>();
  const pairs: [Attendee, Attendee][] = [];

  for (let i = 0; i < shuffled.length; i++) {
    const a = shuffled[i]!;
    if (matched.has(a.id)) continue;

    for (let j = i + 1; j < shuffled.length; j++) {
      const b = shuffled[j]!;
      if (matched.has(b.id)) continue;

      const pairKey = makePairKey(a.id, b.id);
      if (previousPairs.has(pairKey)) continue;
      if (!areCompatible(a, b)) continue;

      pairs.push([a, b]);
      matched.add(a.id);
      matched.add(b.id);
      break;
    }
  }

  const unmatched = shuffled.filter((a) => !matched.has(a.id));
  return { pairs, unmatched };
}

export function makePairKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`;
}

export function computeCompatibilityScore(a: Attendee, b: Attendee): number {
  const baseScore = Math.floor(Math.random() * 41) + 20; // 20–60

  const sharedInterests = a.interests.filter((i) => b.interests.includes(i));
  const interestBonus = Math.min(sharedInterests.length * 10, 50);

  const ageDiff = Math.abs(a.age - b.age);
  let ageBonus = 0;
  if (ageDiff <= 5) ageBonus = 10;
  else if (ageDiff <= 10) ageBonus = 5;

  return Math.min(baseScore + interestBonus + ageBonus, 100);
}
