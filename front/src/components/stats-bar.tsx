import type { SimulationTick } from "@site-unseen/shared";

interface StatsBarProps {
  tick: SimulationTick;
}

export default function StatsBar({ tick }: StatsBarProps) {
  return (
    <div className="sim-stats">
      <div className="sim-stat">
        <span className="sim-stat-value">{tick.completedDates}</span>
        <span className="sim-stat-label">Dates Completed</span>
      </div>
      <div className="sim-stat-divider" />
      <div className="sim-stat">
        <span className="sim-stat-value">{tick.totalEarlyExits}</span>
        <span className="sim-stat-label">Early Exits</span>
      </div>
      <div className="sim-stat-divider" />
      <div className="sim-stat">
        <span className="sim-stat-value">{tick.activePairs.length}</span>
        <span className="sim-stat-label">Active Now</span>
      </div>
      <div className="sim-stat-divider" />
      <div className="sim-stat">
        <span className="sim-stat-value">{tick.waitingAttendees.length}</span>
        <span className="sim-stat-label">Waiting</span>
      </div>
    </div>
  );
}
