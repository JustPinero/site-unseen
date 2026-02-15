import type {
  Attendee,
  SimulatedDate,
  SimulationResult,
} from "@site-unseen/shared";
import { Gender, Sexuality } from "@site-unseen/shared";

interface DemographicStats {
  totalDates: number;
  averageCompatibility: number;
  earlyExitRate: number;
}

interface AgeBracketStats extends DemographicStats {
  bracket: string;
}

interface ResultData {
  byGender: Record<string, DemographicStats>;
  bySexuality: Record<string, DemographicStats>;
  byEthnicity: Record<string, DemographicStats>;
  byAgeBracket: AgeBracketStats[];
  attendeesWithZeroDates: number;
  compatibilityDistribution: Record<string, number>;
}

export function aggregateResults(
  simulationId: string,
  totalRounds: number,
  attendees: Attendee[],
  dates: SimulatedDate[],
): Omit<SimulationResult, "id"> {
  const attendeeMap = new Map(attendees.map((a) => [a.id, a]));

  const totalDatesCompleted = dates.length;
  const totalEarlyExits = dates.filter((d) => d.endedEarly).length;

  // Count dates per attendee
  const datesPerAttendee = new Map<string, number>();
  for (const a of attendees) {
    datesPerAttendee.set(a.id, 0);
  }
  for (const d of dates) {
    datesPerAttendee.set(d.attendeeAId, (datesPerAttendee.get(d.attendeeAId) ?? 0) + 1);
    datesPerAttendee.set(d.attendeeBId, (datesPerAttendee.get(d.attendeeBId) ?? 0) + 1);
  }

  const averageDatesPerAttendee =
    attendees.length > 0
      ? [...datesPerAttendee.values()].reduce((a, b) => a + b, 0) / attendees.length
      : 0;

  const attendeesWithZeroDates = [...datesPerAttendee.values()].filter(
    (count) => count === 0,
  ).length;

  // Demographic breakdowns
  const byGender = computeGroupStats(attendees, dates, attendeeMap, (a) => a.gender);
  const bySexuality = computeGroupStats(attendees, dates, attendeeMap, (a) => a.sexuality);
  const byEthnicity = computeGroupStats(attendees, dates, attendeeMap, (a) => a.ethnicity);

  // Age bracket stats
  const byAgeBracket = computeAgeBracketStats(attendees, dates, attendeeMap);

  // Compatibility score distribution (buckets of 10)
  const compatibilityDistribution: Record<string, number> = {};
  for (let i = 0; i <= 90; i += 10) {
    const label = `${i}-${i + 9}`;
    compatibilityDistribution[label] = 0;
  }
  for (const d of dates) {
    const bucket = Math.min(Math.floor(d.compatibilityScore / 10) * 10, 90);
    const label = `${bucket}-${bucket + 9}`;
    compatibilityDistribution[label] = (compatibilityDistribution[label] ?? 0) + 1;
  }

  const resultData: Record<string, unknown> = {
    byGender,
    bySexuality,
    byEthnicity,
    byAgeBracket,
    attendeesWithZeroDates,
    compatibilityDistribution,
  };

  return {
    simulationId,
    totalRounds,
    totalDatesCompleted,
    totalEarlyExits,
    averageDatesPerAttendee: Math.round(averageDatesPerAttendee * 100) / 100,
    resultData,
  };
}

function computeGroupStats(
  attendees: Attendee[],
  dates: SimulatedDate[],
  attendeeMap: Map<string, Attendee>,
  groupBy: (a: Attendee) => string,
): Record<string, DemographicStats> {
  const groups = new Map<string, { dates: SimulatedDate[]; attendeeCount: number }>();

  // Initialize groups
  for (const a of attendees) {
    const key = groupBy(a);
    if (!groups.has(key)) {
      groups.set(key, { dates: [], attendeeCount: 0 });
    }
    groups.get(key)!.attendeeCount++;
  }

  // Assign dates to groups (a date counts for both attendees' groups)
  for (const d of dates) {
    const attendeeA = attendeeMap.get(d.attendeeAId);
    const attendeeB = attendeeMap.get(d.attendeeBId);
    if (attendeeA) {
      const key = groupBy(attendeeA);
      groups.get(key)?.dates.push(d);
    }
    if (attendeeB) {
      const key = groupBy(attendeeB);
      groups.get(key)?.dates.push(d);
    }
  }

  const result: Record<string, DemographicStats> = {};
  for (const [key, group] of groups) {
    const totalDates = group.dates.length;
    const earlyExits = group.dates.filter((d) => d.endedEarly).length;
    const avgCompat =
      totalDates > 0
        ? group.dates.reduce((sum, d) => sum + d.compatibilityScore, 0) / totalDates
        : 0;

    result[key] = {
      totalDates,
      averageCompatibility: Math.round(avgCompat * 100) / 100,
      earlyExitRate: totalDates > 0 ? Math.round((earlyExits / totalDates) * 10000) / 100 : 0,
    };
  }

  return result;
}

function getAgeBracket(age: number): string {
  if (age < 25) return "21-24";
  if (age < 30) return "25-29";
  if (age < 35) return "30-34";
  if (age < 40) return "35-39";
  if (age < 45) return "40-44";
  return "45+";
}

function computeAgeBracketStats(
  attendees: Attendee[],
  dates: SimulatedDate[],
  attendeeMap: Map<string, Attendee>,
): AgeBracketStats[] {
  const stats = computeGroupStats(attendees, dates, attendeeMap, (a) =>
    getAgeBracket(a.age),
  );

  const bracketOrder = ["21-24", "25-29", "30-34", "35-39", "40-44", "45+"];
  return bracketOrder
    .filter((b) => stats[b])
    .map((bracket) => ({
      bracket,
      ...stats[bracket]!,
    }));
}
