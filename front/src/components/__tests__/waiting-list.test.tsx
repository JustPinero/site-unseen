import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WaitingList from "../waiting-list";
import { Gender, Sexuality } from "@site-unseen/shared";

const attendees = [
  { id: "1", name: "Alice", gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL, age: 25 },
  { id: "2", name: "Bob", gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL, age: 30 },
];

describe("WaitingList", () => {
  it("renders attendee names", () => {
    render(<WaitingList attendees={attendees} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders attendee count", () => {
    render(<WaitingList attendees={attendees} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows empty state when no attendees", () => {
    render(<WaitingList attendees={[]} />);
    expect(screen.getByText("Everyone is on a date!")).toBeInTheDocument();
  });
});
