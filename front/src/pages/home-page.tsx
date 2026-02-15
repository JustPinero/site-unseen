import { Link } from "react-router-dom";
import { useMemo } from "react";

const HEART_CHARS = ["\u2764", "\u2665", "\uD83E\uDE77", "\uD83D\uDC95"];

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        char: HEART_CHARS[i % HEART_CHARS.length],
        left: `${5 + (i * 8) % 90}%`,
        size: 0.7 + (i % 4) * 0.3,
        duration: 6 + (i % 5) * 2,
        delay: i * 0.8,
      })),
    [],
  );

  return (
    <div className="hero-hearts">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="hero-heart"
          style={{
            left: h.left,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <FloatingHearts />
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

      <div className="home-modes">
        <div className="divider-arrow">{"\u{1F3F9}"}</div>
        <div className="home-modes-grid">
          <div className="home-mode-card">
            <div className="home-mode-icon">{"\u{1F496}"}</div>
            <h3>Real-Time Mode</h3>
            <p>
              Watch dates unfold second by second. Multiple viewers stay
              perfectly in sync. Join anytime.
            </p>
          </div>
          <div className="home-mode-card">
            <div className="home-mode-icon">{"\u26A1"}</div>
            <h3>Quick Mode</h3>
            <p>
              Get instant results with full analytics. Compatibility scores,
              demographic breakdowns, and more.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
