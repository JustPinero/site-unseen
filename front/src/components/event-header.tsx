import type { SimulationTick } from "@site-unseen/shared";

interface EventHeaderProps {
  tick: SimulationTick;
  connected: boolean;
}

function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}`;
  return `${m}:00`;
}

const PHASE_LABELS: Record<string, string> = {
  matching: "Matching",
  dating: "Dating",
  break: "Break",
};

export default function EventHeader({ tick, connected }: EventHeaderProps) {
  return (
    <div className="sim-header">
      <div className="sim-header-left">
        <div className="sim-clock">
          <span className="sim-clock-label">Event Clock</span>
          <span className="sim-clock-time">{formatClock(tick.eventClock)}</span>
        </div>
        <div className="sim-round">
          <span className="sim-clock-label">Round</span>
          <span className="sim-clock-time">{tick.currentRound}</span>
        </div>
      </div>

      <div className="sim-header-center">
        <span className={`sim-phase sim-phase-${tick.roundPhase}`}>
          {PHASE_LABELS[tick.roundPhase] ?? tick.roundPhase}
        </span>
      </div>

      <div className="sim-header-right">
        <span className={`sim-connection ${connected ? "sim-connection-on" : "sim-connection-off"}`}>
          {connected ? "Live" : "Reconnecting..."}
        </span>
      </div>
    </div>
  );
}
