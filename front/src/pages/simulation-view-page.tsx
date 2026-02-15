import { useParams, useNavigate } from "react-router-dom";
import { useSimulation } from "../hooks/use-simulation";

export default function SimulationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sim = useSimulation(id ?? null);

  if (sim.phase === "completed") {
    navigate(`/simulations/${id}/results`, { replace: true });
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Simulation View</h1>
        <p>
          {sim.phase === "connecting" && "Connecting..."}
          {sim.phase === "waiting" && "Waiting to start"}
          {sim.phase === "running" && "Simulation in progress"}
          {sim.phase === "error" && "Error occurred"}
          {sim.phase === "idle" && "Initializing..."}
        </p>
      </div>

      {sim.error && <div className="error-message">{sim.error}</div>}

      {sim.phase === "waiting" && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ marginBottom: "1rem", color: "var(--gray-500)" }}>
            Ready to start the simulation
          </p>
          <button className="btn btn-primary" onClick={sim.start}>
            Start Simulation
          </button>
        </div>
      )}

      {sim.phase === "running" && sim.tick && (
        <div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div className="card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Event Clock</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-600)" }}>
                {sim.tick.eventClock}m
              </div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Round</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-600)" }}>
                {sim.tick.currentRound}
              </div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Phase</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-600)" }}>
                {sim.tick.roundPhase}
              </div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Dates Done</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-600)" }}>
                {sim.tick.completedDates}
              </div>
            </div>
          </div>

          <p style={{ color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            Full real-time view coming in Request #007
          </p>

          {sim.tick.activePairs.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: "0.75rem", color: "var(--gray-700)" }}>Active Dates</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {sim.tick.activePairs.map((pair, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.4rem 0",
                      borderBottom: "1px solid var(--gray-100)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>
                      {pair.attendeeA.name} + {pair.attendeeB.name}
                    </span>
                    <span style={{ color: "var(--gray-400)" }}>
                      {pair.dateMinutesElapsed}/{pair.dateLengthMinutes}min
                      {pair.endedEarly && " (left early)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
