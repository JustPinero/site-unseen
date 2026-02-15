import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SimulationListPage from "../simulation-list-page";

// Mock the API module
vi.mock("../../api", () => ({
  listSimulations: vi.fn(),
}));

// Mock the lobby hook
vi.mock("../../hooks/use-lobby", () => ({
  useLobby: vi.fn(),
}));

import { listSimulations } from "../../api";

const mockedList = vi.mocked(listSimulations);

function renderPage() {
  return render(
    <MemoryRouter>
      <SimulationListPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SimulationListPage", () => {
  it("renders the page title", async () => {
    mockedList.mockResolvedValue({ data: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } });
    renderPage();
    expect(screen.getByText("Simulations")).toBeInTheDocument();
  });

  it("shows empty state when no simulations", async () => {
    mockedList.mockResolvedValue({ data: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/No simulations yet/)).toBeInTheDocument();
    });
  });

  it("renders filter tabs", async () => {
    mockedList.mockResolvedValue({ data: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } });
    renderPage();

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
