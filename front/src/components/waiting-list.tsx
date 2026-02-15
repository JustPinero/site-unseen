import type { AttendeeSnapshot } from "@site-unseen/shared";
import { Gender } from "@site-unseen/shared";

interface WaitingListProps {
  attendees: AttendeeSnapshot[];
}

function genderIcon(gender: string): string {
  return gender === Gender.MALE ? "\u2642" : "\u2640";
}

export default function WaitingList({ attendees }: WaitingListProps) {
  return (
    <div className="sim-waiting">
      <h3 className="sim-section-title">
        Waiting <span className="sim-waiting-count">{attendees.length}</span>
      </h3>
      {attendees.length === 0 ? (
        <p className="sim-waiting-empty">Everyone is on a date!</p>
      ) : (
        <ul className="sim-waiting-list">
          {attendees.map((a) => (
            <li key={a.id} className="sim-waiting-item">
              <span className="sim-waiting-gender">{genderIcon(a.gender)}</span>
              <span className="sim-waiting-name">{a.name}</span>
              <span className="sim-waiting-age">{a.age}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
