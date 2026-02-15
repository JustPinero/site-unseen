import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "../not-found-page";

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  );
}

describe("NotFoundPage", () => {
  it("renders the not found message", () => {
    renderPage();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("has a link back to home", () => {
    renderPage();
    const link = screen.getByText("Go Home");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/");
  });
});
