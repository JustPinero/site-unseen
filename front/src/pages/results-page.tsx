import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { SimulationResult } from "@site-unseen/shared";
import { getResults } from "../api";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getResults(id)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load results"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><div className="loading">Loading results...</div></div>;
  if (error) return (
    <div className="container">
      <div className="page-header"><h1>Results</h1></div>
      <div className="error-message">{error}</div>
      <Link to="/simulations" className="btn btn-secondary">Back to Simulations</Link>
    </div>
  );
  if (!result) return null;

  const data = result.resultData as Record<string, unknown>;
  const compatDist = data.compatibilityDistribution as Record<string, number> | undefined;
  const attendeesWithZero = data.attendeesWithZeroDates as number | undefined;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Results</h1>
        <p>Simulation complete</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <StatCard label="Total Rounds" value={result.totalRounds} />
        <StatCard label="Dates Completed" value={result.totalDatesCompleted} />
        <StatCard label="Early Exits" value={result.totalEarlyExits} />
        <StatCard label="Avg Dates/Attendee" value={result.averageDatesPerAttendee} />
      </div>

      {attendeesWithZero !== undefined && attendeesWithZero > 0 && (
        <div className="card" style={{ marginBottom: "1rem", background: "#fef3c7" }}>
          <p style={{ fontSize: "0.9rem", color: "#92400e" }}>
            {attendeesWithZero} attendee{attendeesWithZero > 1 ? "s" : ""} had zero dates
          </p>
        </div>
      )}

      {compatDist && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.75rem", color: "var(--gray-700)" }}>
            Compatibility Score Distribution
          </h3>
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "end", height: 120 }}>
            {Object.entries(compatDist).map(([bucket, count]) => {
              const maxCount = Math.max(...Object.values(compatDist), 1);
              const height = (count / maxCount) * 100;
              return (
                <div
                  key={bucket}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <span style={{ fontSize: "0.65rem", color: "var(--gray-400)" }}>
                    {count}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: `${height}%`,
                      minHeight: count > 0 ? 4 : 0,
                      background: "var(--pink-400)",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                  <span style={{ fontSize: "0.6rem", color: "var(--gray-400)" }}>
                    {bucket.split("-")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link to="/simulations" className="btn btn-secondary">
          All Simulations
        </Link>
        <Link to="/create" className="btn btn-primary">
          New Simulation
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--pink-600)" }}>
        {value}
      </div>
    </div>
  );
}
