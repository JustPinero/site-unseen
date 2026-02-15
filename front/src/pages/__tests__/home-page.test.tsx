import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../home-page";

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("renders the hero title", () => {
    renderPage();
    expect(screen.getByText("Site Unseen")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderPage();
    expect(screen.getByText("Create Simulation")).toBeInTheDocument();
    expect(screen.getByText("Browse Simulations")).toBeInTheDocument();
  });

  it("renders mode descriptions", () => {
    renderPage();
    expect(screen.getByText("Real-Time Mode")).toBeInTheDocument();
    expect(screen.getByText("Quick Mode")).toBeInTheDocument();
  });
});
