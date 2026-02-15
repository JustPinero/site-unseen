import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateSimulationPage from "../create-simulation-page";

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateSimulationPage />
    </MemoryRouter>,
  );
}

describe("CreateSimulationPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByText("Create Simulation")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    renderPage();
    expect(screen.getByLabelText("Simulation Name")).toBeInTheDocument();
    expect(screen.getByText("Mode")).toBeInTheDocument();
  });

  it("has both mode radio buttons", () => {
    renderPage();
    expect(screen.getByText("Real-Time")).toBeInTheDocument();
    expect(screen.getByText("Quick")).toBeInTheDocument();
  });

  it("toggles advanced settings", async () => {
    renderPage();
    const user = userEvent.setup();

    expect(screen.queryByText(/demographic settings/i)).not.toBeInTheDocument();
    await user.click(screen.getByText("Advanced"));
    expect(screen.getByText(/demographic settings/i)).toBeInTheDocument();
  });
});
