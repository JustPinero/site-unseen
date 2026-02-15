import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Simulation, SimulationResult } from "@site-unseen/shared";
import { getResults, getSimulation, getDates } from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const VALENTINE_PALETTE = [
  "#E91E63", "#C62828", "#F06292", "#EF5350", "#F8BBD0",
  "#D81B60", "#C2185B", "#F48FB1", "#FF8A80", "#FF5252",
];

interface DemographicStats {
  totalDates: number;
  averageCompatibility: number;
  earlyExitRate: number;
}

interface ResultData {
  byGender: Record<string, DemographicStats>;
  bySexuality: Record<string, DemographicStats>;
  byEthnicity: Record<string, DemographicStats>;
  byAgeBracket: Array<{ bracket: string } & DemographicStats>;
  attendeesWithZeroDates: number;
  compatibilityDistribution: Record<string, number>;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [sim, setSim] = useState<Simulation | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [datesPerAttendee, setDatesPerAttendee] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getSimulation(id),
      getResults(id),
      getDates(id),
    ])
      .then(([simData, resultData, dates]) => {
        setSim(simData);
        setResult(resultData);

        // Build dates-per-attendee histogram
        const counts = new Map<string, number>();
        for (const d of dates) {
          counts.set(d.attendeeAId, (counts.get(d.attendeeAId) ?? 0) + 1);
          counts.set(d.attendeeBId, (counts.get(d.attendeeBId) ?? 0) + 1);
        }
        // Include attendees with 0 dates
        if (simData.attendees) {
          for (const a of simData.attendees) {
            if (!counts.has(a.id)) counts.set(a.id, 0);
          }
        }
        const histogram: Record<number, number> = {};
        for (const c of counts.values()) {
          histogram[c] = (histogram[c] ?? 0) + 1;
        }
        setDatesPerAttendee(histogram);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load results"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="page-header"><h1>Results</h1></div>
        <div className="error-message">{error}</div>
        <Link to="/simulations" className="btn btn-secondary">Back to Simulations</Link>
      </div>
    );
  }

  if (!result) return null;

  const data = result.resultData as unknown as ResultData;

  return (
    <div className="container">
      {/* Header */}
      <div className="results-header">
        <div>
          <h1 className="results-title">{sim?.name ?? "Simulation"}</h1>
          <p className="results-subtitle">
            {sim && (
              <>
                <span className={`badge ${sim.mode === "DETAILED" ? "badge-running" : "badge-completed"}`} style={{ animation: "none" }}>
                  {sim.mode === "DETAILED" ? "Real-Time" : "Quick"}
                </span>
                {" "}
                {sim.attendeeCount} attendees &middot; {sim.eventLengthMinutes}min event &middot; {sim.dateLengthMinutes}min dates
              </>
            )}
          </p>
        </div>
      </div>

      {/* 1. Overview Cards */}
      <div className="results-overview">
        <OverviewCard label="Total Rounds" value={result.totalRounds} />
        <OverviewCard label="Dates Completed" value={result.totalDatesCompleted} />
        <OverviewCard label="Early Exits" value={result.totalEarlyExits} />
        <OverviewCard label="Avg Dates / Attendee" value={result.averageDatesPerAttendee} />
        {data.attendeesWithZeroDates > 0 && (
          <OverviewCard label="Zero-Date Attendees" value={data.attendeesWithZeroDates} warn />
        )}
      </div>

      {/* Charts Grid */}
      <div className="results-grid">
        {/* 2. Dates by Gender */}
        <ChartCard title="Dates by Gender">
          <BarChartSimple
            data={Object.entries(data.byGender).map(([k, v]) => ({
              name: k === "MALE" ? "Male" : "Female",
              dates: v.totalDates,
            }))}
            dataKey="dates"
          />
          <ChartSummary entries={Object.entries(data.byGender).map(([k, v]) => [
            k === "MALE" ? "Male" : "Female",
            `${v.totalDates} dates, ${v.averageCompatibility} avg compat`,
          ])} />
        </ChartCard>

        {/* 3. Dates by Sexuality */}
        <ChartCard title="Dates by Sexuality">
          <BarChartSimple
            data={Object.entries(data.bySexuality).map(([k, v]) => ({
              name: k.charAt(0) + k.slice(1).toLowerCase(),
              dates: v.totalDates,
            }))}
            dataKey="dates"
          />
          <ChartSummary entries={Object.entries(data.bySexuality).map(([k, v]) => [
            k.charAt(0) + k.slice(1).toLowerCase(),
            `${v.earlyExitRate}% early exit rate`,
          ])} />
        </ChartCard>

        {/* 4a. Gender Distribution (Pie) */}
        <ChartCard title="Gender Distribution">
          <PieChartSimple
            data={Object.entries(data.byGender).map(([k, v]) => ({
              name: k === "MALE" ? "Male" : "Female",
              value: v.totalDates || 1,
            }))}
          />
        </ChartCard>

        {/* 4b. Sexuality Distribution (Pie) */}
        <ChartCard title="Sexuality Distribution">
          <PieChartSimple
            data={Object.entries(data.bySexuality).map(([k, v]) => ({
              name: k.charAt(0) + k.slice(1).toLowerCase(),
              value: v.totalDates || 1,
            }))}
          />
        </ChartCard>

        {/* 4c. Ethnicity Distribution (Pie) */}
        <ChartCard title="Ethnicity Distribution">
          <PieChartSimple
            data={Object.entries(data.byEthnicity).map(([k, v]) => ({
              name: k,
              value: v.totalDates || 1,
            }))}
          />
        </ChartCard>

        {/* 5. Dates Per Attendee Histogram */}
        <ChartCard title="Dates Per Attendee">
          <BarChartSimple
            data={Object.entries(datesPerAttendee)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([k, v]) => ({
                name: k === "0" ? "0 dates" : `${k}`,
                attendees: v,
              }))}
            dataKey="attendees"
            color={VALENTINE_PALETTE[1]}
          />
        </ChartCard>

        {/* 6. Compatibility Score Distribution */}
        <ChartCard title="Compatibility Scores">
          <BarChartSimple
            data={Object.entries(data.compatibilityDistribution).map(([k, v]) => ({
              name: k.split("-")[0]!,
              count: v,
            }))}
            dataKey="count"
            color={VALENTINE_PALETTE[2]}
          />
        </ChartCard>

        {/* 7. Dates by Age Bracket */}
        <ChartCard title="Dates by Age">
          <BarChartSimple
            data={data.byAgeBracket.map((b) => ({
              name: b.bracket,
              dates: b.totalDates,
            }))}
            dataKey="dates"
            color={VALENTINE_PALETTE[3]}
          />
          <ChartSummary entries={data.byAgeBracket.map((b) => [
            b.bracket,
            `${b.averageCompatibility} avg compat`,
          ])} />
        </ChartCard>

        {/* 8. Early Exit Rate (Donut) */}
        <ChartCard title="Early Exit Rate">
          <PieChartSimple
            data={[
              { name: "Completed", value: result.totalDatesCompleted - result.totalEarlyExits },
              { name: "Early Exit", value: result.totalEarlyExits },
            ]}
            donut
          />
          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--gray-500)" }}>
              {result.totalDatesCompleted > 0
                ? `${Math.round((result.totalEarlyExits / result.totalDatesCompleted) * 100)}%`
                : "0%"}{" "}
              of dates ended early
            </span>
          </div>
        </ChartCard>
      </div>

      {/* Footer nav */}
      <div className="divider-arrow">{"\u{1F3F9}"}</div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "3rem" }}>
        <Link to="/simulations" className="btn btn-secondary">All Simulations</Link>
        <Link to="/create" className="btn btn-primary">New Simulation</Link>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function OverviewCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="results-stat-card" style={warn ? { background: "#fef3c7", borderColor: "#fde68a" } : undefined}>
      <div className="results-stat-value" style={warn ? { color: "#92400e" } : undefined}>
        {value}
      </div>
      <div className="results-stat-label">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="results-chart-card">
      <h3 className="results-chart-title">{title}</h3>
      {children}
    </div>
  );
}

function ChartSummary({ entries }: { entries: [string, string][] }) {
  return (
    <div className="results-chart-summary">
      {entries.map(([label, val]) => (
        <span key={label}><strong>{label}:</strong> {val}</span>
      ))}
    </div>
  );
}

function BarChartSimple({
  data,
  dataKey,
  color = VALENTINE_PALETTE[0],
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#757575" }} />
        <YAxis tick={{ fontSize: 11, fill: "#757575" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #F8BBD0", fontSize: 13 }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartSimple({
  data,
  donut,
}: {
  data: Array<{ name: string; value: number }>;
  donut?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={donut ? 45 : 0}
          outerRadius={75}
          dataKey="value"
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
          fontSize={11}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={VALENTINE_PALETTE[i % VALENTINE_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #F8BBD0", fontSize: 13 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
