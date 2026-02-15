import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSimulation } from "../hooks/use-simulation";
import EventHeader from "../components/event-header";
import ActiveDatesTable from "../components/active-dates-table";
import WaitingList from "../components/waiting-list";
import StatsBar from "../components/stats-bar";
import ConnectionOverlay from "../components/connection-overlay";

export default function SimulationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sim = useSimulation(id ?? null);

  useEffect(() => {
    if (sim.phase === "completed") {
      navigate(`/simulations/${id}/results`, { replace: true });
    }
  }, [sim.phase, id, navigate]);

  const showOverlay = sim.phase === "running" && !sim.connected;

  return (
    <div className="container">
      <ConnectionOverlay visible={showOverlay} />

      {sim.error && <div className="error-message">{sim.error}</div>}

      {(sim.phase === "idle" || sim.phase === "connecting") && (
        <div className="loading">Connecting to simulation...</div>
      )}

      {sim.phase === "waiting" && (
        <div style={{ marginTop: "3rem" }}>
          <div className="card" style={{ textAlign: "center", padding: "3rem", maxWidth: 500, margin: "0 auto" }}>
            <h2 style={{ color: "var(--pink-600)", marginBottom: "0.5rem" }}>Ready to Go</h2>
            <p style={{ marginBottom: "1.5rem", color: "var(--gray-500)" }}>
              Attendees are generated. Start the simulation to watch dates unfold in real time.
            </p>
            <button className="btn btn-primary" onClick={sim.start}>
              Start Simulation
            </button>
          </div>
        </div>
      )}

      {sim.phase === "running" && sim.tick && (
        <>
          <EventHeader tick={sim.tick} connected={sim.connected} />

          <div className="sim-layout">
            <div className="sim-main">
              <ActiveDatesTable pairs={sim.tick.activePairs} />
            </div>
            <aside className="sim-sidebar">
              <WaitingList attendees={sim.tick.waitingAttendees} />
            </aside>
          </div>

          <StatsBar tick={sim.tick} />
        </>
      )}
    </div>
  );
}
