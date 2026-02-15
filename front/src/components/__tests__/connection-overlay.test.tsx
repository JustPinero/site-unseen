import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConnectionOverlay from "../connection-overlay";

describe("ConnectionOverlay", () => {
  it("renders nothing when not visible", () => {
    const { container } = render(<ConnectionOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders overlay when visible", () => {
    render(<ConnectionOverlay visible={true} />);
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();
  });

  it("has the overlay class", () => {
    const { container } = render(<ConnectionOverlay visible={true} />);
    expect(container.querySelector(".sim-overlay")).toBeInTheDocument();
  });
});
