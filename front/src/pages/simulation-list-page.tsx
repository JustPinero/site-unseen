import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Simulation } from "@site-unseen/shared";
import { listSimulations } from "../api";
import { useLobby } from "../hooks/use-lobby";

type FilterTab = "ALL" | "LIVE" | "COMPLETED";
type SortOption = "newest" | "viewers" | "attendees";

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
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");

  // Fetch initial simulation list
  useEffect(() => {
    setLoading(true);
    setError(null);
    listSimulations({ limit: 100 })
      .then((res) => setSimulations(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  // Live lobby updates
  const onSimulationUpdate = useCallback((simulation: Simulation) => {
    setSimulations((prev) => {
      const idx = prev.findIndex((s) => s.id === simulation.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = simulation;
        return next;
      }
      // New simulation — add to beginning
      return [simulation, ...prev];
    });
  }, []);

  const onViewerCount = useCallback((simulationId: string, viewerCount: number) => {
    setViewerCounts((prev) => ({ ...prev, [simulationId]: viewerCount }));
  }, []);

  useLobby({ onSimulationUpdate, onViewerCount });

  // Filter + search + sort
  const filtered = useMemo(() => {
    let list = simulations;

    // Tab filter
    if (filterTab === "LIVE") {
      list = list.filter((s) => s.status === "RUNNING");
    } else if (filterTab === "COMPLETED") {
      list = list.filter((s) => s.status === "COMPLETED");
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    // Sort
    const sorted = [...list];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "viewers") {
      sorted.sort((a, b) => (viewerCounts[b.id] ?? 0) - (viewerCounts[a.id] ?? 0));
    } else if (sortBy === "attendees") {
      sorted.sort((a, b) => b.attendeeCount - a.attendeeCount);
    }

    return sorted;
  }, [simulations, filterTab, search, sortBy, viewerCounts]);

  const liveCount = simulations.filter((s) => s.status === "RUNNING").length;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Simulations</h1>
        <p>Browse all speed dating simulations</p>
      </div>

      {/* Toolbar: filter tabs, search, sort */}
      <div className="lobby-toolbar">
        <div className="lobby-tabs">
          <button
            className={`lobby-tab ${filterTab === "ALL" ? "lobby-tab-active" : ""}`}
            onClick={() => setFilterTab("ALL")}
          >
            All
          </button>
          <button
            className={`lobby-tab ${filterTab === "LIVE" ? "lobby-tab-active" : ""}`}
            onClick={() => setFilterTab("LIVE")}
          >
            Live {liveCount > 0 && <span className="lobby-tab-count">{liveCount}</span>}
          </button>
          <button
            className={`lobby-tab ${filterTab === "COMPLETED" ? "lobby-tab-active" : ""}`}
            onClick={() => setFilterTab("COMPLETED")}
          >
            Completed
          </button>
        </div>

        <div className="lobby-controls">
          <input
            type="text"
            className="form-input lobby-search"
            placeholder="Search simulations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select lobby-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest</option>
            <option value="viewers">Most Viewers</option>
            <option value="attendees">Most Attendees</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading simulations...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--gray-400)" }}>
            {search ? "No simulations match your search" : "No simulations found"}
          </p>
          <Link to="/create" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Create One
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((sim) => (
            <SimulationCard
              key={sim.id}
              sim={sim}
              viewerCount={viewerCounts[sim.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SimulationCard({ sim, viewerCount }: { sim: Simulation; viewerCount: number }) {
  const isLive = sim.status === "RUNNING";
  const isCompleted = sim.status === "COMPLETED";
  const isPending = sim.status === "PENDING";

  const linkTo = isCompleted
    ? `/simulations/${sim.id}/results`
    : `/simulations/${sim.id}`;

  return (
    <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
      <div className={`card lobby-card ${isLive ? "lobby-card-live" : ""}`}>
        {/* Header: name + badge */}
        <div className="lobby-card-header">
          <h3 className="lobby-card-name">{sim.name}</h3>
          {isLive && <span className="badge badge-running lobby-badge-live">LIVE</span>}
          {isPending && <span className="badge badge-pending">Waiting</span>}
          {isCompleted && <span className="badge badge-completed">Completed</span>}
        </div>

        {/* Details */}
        <div className="lobby-card-details">
          <span>{sim.mode === "DETAILED" ? "Real-Time" : "Quick"}</span>
          <span>{sim.attendeeCount} attendees</span>
          <span>{sim.eventLengthMinutes}min / {sim.dateLengthMinutes}min dates</span>
        </div>

        {/* Footer: viewer count + action hint + date */}
        <div className="lobby-card-footer">
          <div className="lobby-card-meta">
            {isLive && viewerCount > 0 && (
              <span className="lobby-viewers">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {viewerCount}
              </span>
            )}
            <span className="lobby-card-date">{formatDate(sim.createdAt)}</span>
          </div>
          <div className="lobby-card-action">
            {isLive && <span className="btn btn-primary btn-sm">Watch Live</span>}
            {isCompleted && <span className="btn btn-secondary btn-sm">View Results</span>}
            {isPending && <span className="btn btn-secondary btn-sm">Start</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
