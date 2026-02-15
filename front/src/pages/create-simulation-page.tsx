import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimulationMode } from "@site-unseen/shared";
import { createSimulation } from "../api";

export default function CreateSimulationPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mode, setMode] = useState<SimulationMode>(SimulationMode.DETAILED);
  const [eventLength, setEventLength] = useState(60);
  const [dateLength, setDateLength] = useState(5);
  const [breakLength, setBreakLength] = useState(1);
  const [attendeeCount, setAttendeeCount] = useState(20);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxRounds = Math.floor(eventLength / (dateLength + breakLength));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a simulation name");
      return;
    }

    setSubmitting(true);
    try {
      const sim = await createSimulation({
        name: name.trim(),
        mode,
        eventLengthMinutes: eventLength,
        dateLengthMinutes: dateLength,
        breakLengthMinutes: breakLength,
        attendeeCount,
      });

      if (mode === SimulationMode.QUICK) {
        navigate(`/simulations/${sim.id}/results`);
      } else {
        navigate(`/simulations/${sim.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create simulation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Create Simulation</h1>
        <p>Configure your speed dating event</p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 550 }}
      >
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="name">Simulation Name</label>
          <input
            id="name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Valentine's Mixer"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mode</label>
          <div className="mode-toggle">
            <label>
              <input
                type="radio"
                name="mode"
                checked={mode === SimulationMode.DETAILED}
                onChange={() => setMode(SimulationMode.DETAILED)}
              />
              <span>Real-Time</span>
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                checked={mode === SimulationMode.QUICK}
                onChange={() => setMode(SimulationMode.QUICK)}
              />
              <span>Quick</span>
            </label>
          </div>
          <p className="form-hint">
            {mode === SimulationMode.DETAILED
              ? "Watch the simulation unfold in real time (1 sim min = 1 real sec)"
              : "Get instant results — no waiting"}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="eventLength">
            Event Length: {eventLength} minutes
          </label>
          <input
            id="eventLength"
            className="form-range"
            type="range"
            min={15}
            max={180}
            step={5}
            value={eventLength}
            onChange={(e) => setEventLength(Number(e.target.value))}
          />
          <p className="form-hint">15–180 minutes</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dateLength">
            Date Length: {dateLength} minutes
          </label>
          <input
            id="dateLength"
            className="form-range"
            type="range"
            min={2}
            max={15}
            value={dateLength}
            onChange={(e) => setDateLength(Number(e.target.value))}
          />
          <p className="form-hint">2–15 minutes per date</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="breakLength">
            Break Between Dates: {breakLength} minute{breakLength !== 1 ? "s" : ""}
          </label>
          <input
            id="breakLength"
            className="form-range"
            type="range"
            min={0}
            max={5}
            value={breakLength}
            onChange={(e) => setBreakLength(Number(e.target.value))}
          />
          <p className="form-hint">0–5 minutes</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="attendeeCount">
            Attendees: {attendeeCount}
          </label>
          <input
            id="attendeeCount"
            className="form-range"
            type="range"
            min={4}
            max={100}
            step={2}
            value={attendeeCount}
            onChange={(e) => setAttendeeCount(Number(e.target.value))}
          />
          <p className="form-hint">4–100 attendees</p>
        </div>

        <div className="card" style={{ marginBottom: "1.25rem", background: "var(--pink-50)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--gray-600)" }}>
            <strong>Summary:</strong> {attendeeCount} attendees, {maxRounds} rounds max,{" "}
            {mode === SimulationMode.DETAILED
              ? `~${eventLength}s real time`
              : "instant results"}
          </p>
        </div>

        {showAdvanced && (
          <div
            className="card"
            style={{ marginBottom: "1.25rem", background: "var(--gray-50)" }}
          >
            <p style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
              Advanced demographic settings (gender ratio, sexuality distribution,
              age range) will be available in a future update.
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Creating..."
              : mode === SimulationMode.QUICK
                ? "Run Simulation"
                : "Create & View"}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced" : "Advanced"}
          </button>
        </div>
      </form>
    </div>
  );
}
