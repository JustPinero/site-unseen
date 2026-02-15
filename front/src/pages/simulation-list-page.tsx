import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Simulation } from "@site-unseen/shared";
import { listSimulations } from "../api";

function statusBadge(status: string) {
  const cls =
    status === "PENDING"
      ? "badge-pending"
      : status === "RUNNING"
        ? "badge-running"
        : "badge-completed";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SimulationListPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listSimulations({
      page,
      limit: 12,
      status: statusFilter || undefined,
      mode: modeFilter || undefined,
    })
      .then((res) => {
        setSimulations(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page, statusFilter, modeFilter]);

  function linkForSim(sim: Simulation) {
    if (sim.status === "COMPLETED") return `/simulations/${sim.id}/results`;
    return `/simulations/${sim.id}`;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Simulations</h1>
        <p>Browse all speed dating simulations</p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <select
          className="form-select"
          style={{ width: "auto" }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="RUNNING">Running</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          className="form-select"
          style={{ width: "auto" }}
          value={modeFilter}
          onChange={(e) => { setModeFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Modes</option>
          <option value="DETAILED">Real-Time</option>
          <option value="QUICK">Quick</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading simulations...</div>
      ) : simulations.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--gray-400)" }}>No simulations found</p>
          <Link to="/create" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Create One
          </Link>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {simulations.map((sim) => (
              <Link
                key={sim.id}
                to={linkForSim(sim)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--gray-800)" }}>{sim.name}</h3>
                    {statusBadge(sim.status)}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <span>Mode: {sim.mode === "DETAILED" ? "Real-Time" : "Quick"}</span>
                    <span>Attendees: {sim.attendeeCount}</span>
                    <span>Event: {sim.eventLengthMinutes}min / {sim.dateLengthMinutes}min dates</span>
                    <span>{formatDate(sim.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <span style={{ fontSize: "0.9rem", color: "var(--gray-500)" }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
