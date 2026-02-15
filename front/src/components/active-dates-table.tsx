import type { ActivePair } from "@site-unseen/shared";
import { Gender } from "@site-unseen/shared";

interface ActiveDatesTableProps {
  pairs: ActivePair[];
}

function genderIcon(gender: string): string {
  return gender === Gender.MALE ? "\u2642" : "\u2640";
}

export default function ActiveDatesTable({ pairs }: ActiveDatesTableProps) {
  if (pairs.length === 0) {
    return (
      <div className="sim-dates-empty">
        <p>No active dates this round</p>
      </div>
    );
  }

  return (
    <div className="sim-dates">
      <h3 className="sim-section-title">Active Dates</h3>
      <div className="sim-dates-list">
        {pairs.map((pair, i) => {
          const progress = pair.dateLengthMinutes > 0
            ? (pair.dateMinutesElapsed / pair.dateLengthMinutes) * 100
            : 0;

          return (
            <div
              key={i}
              className={`sim-date-row ${pair.endedEarly ? "sim-date-early" : ""}`}
            >
              <div className="sim-date-people">
                <div className="sim-date-person">
                  <span className="sim-date-gender">{genderIcon(pair.attendeeA.gender)}</span>
                  <span className="sim-date-name">{pair.attendeeA.name}</span>
                  <span className="sim-date-age">{pair.attendeeA.age}</span>
                </div>

                <span className={`sim-date-heart ${pair.endedEarly ? "sim-date-heart-broken" : ""}`}>
                  {pair.endedEarly ? "\uD83D\uDC94" : "\u2764\uFE0F"}
                </span>

                <div className="sim-date-person">
                  <span className="sim-date-gender">{genderIcon(pair.attendeeB.gender)}</span>
                  <span className="sim-date-name">{pair.attendeeB.name}</span>
                  <span className="sim-date-age">{pair.attendeeB.age}</span>
                </div>
              </div>

              <div className="sim-date-progress-wrap">
                <div className="sim-date-progress-bar">
                  <div
                    className={`sim-date-progress-fill ${pair.endedEarly ? "sim-date-progress-early" : ""}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="sim-date-time">
                  {pair.dateMinutesElapsed}/{pair.dateLengthMinutes}m
                  {pair.endedEarly && (
                    <span className="sim-date-early-badge">Left Early</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
