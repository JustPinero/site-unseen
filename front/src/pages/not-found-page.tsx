import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "4rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{"\uD83D\uDC94"}</div>
      <h1>Page Not Found</h1>
      <p style={{ color: "var(--gray-500)", marginTop: "0.5rem" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        Go Home
      </Link>
    </div>
  );
}
