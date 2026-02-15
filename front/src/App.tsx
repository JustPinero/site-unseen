import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/home-page";
import CreateSimulationPage from "./pages/create-simulation-page";
import SimulationListPage from "./pages/simulation-list-page";
import SimulationViewPage from "./pages/simulation-view-page";
import ResultsPage from "./pages/results-page";

function Nav() {
  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="nav-brand">
          Site Unseen
        </Link>
        <ul className="nav-links">
          <li><Link to="/create">Create</Link></li>
          <li><Link to="/simulations">Browse</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateSimulationPage />} />
        <Route path="/simulations" element={<SimulationListPage />} />
        <Route path="/simulations/:id" element={<SimulationViewPage />} />
        <Route path="/simulations/:id/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
