import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Site Unseen</h1>
        <p>
          Simulate speed dating events with configurable demographics, real-time
          viewing, and detailed analytics. Watch love unfold — or crash and burn.
        </p>
        <div className="hero-buttons">
          <Link to="/create" className="btn btn-primary">
            Create Simulation
          </Link>
          <Link to="/simulations" className="btn btn-secondary">
            Browse Simulations
          </Link>
        </div>
      </section>

      <div className="container" style={{ padding: "3rem 1rem", textAlign: "center" }}>
        <div className="card-grid" style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="card">
            <h3 style={{ color: "var(--pink-600)", marginBottom: "0.5rem" }}>Real-Time Mode</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
              Watch dates unfold second by second. Multiple viewers stay
              perfectly in sync. Join anytime.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: "var(--pink-600)", marginBottom: "0.5rem" }}>Quick Mode</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
              Get instant results with full analytics. Compatibility scores,
              demographic breakdowns, and more.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
