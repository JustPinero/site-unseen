import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActiveDatesTable from "../active-dates-table";
import { Gender, Sexuality } from "@site-unseen/shared";
import type { ActivePair } from "@site-unseen/shared";

const pairs: ActivePair[] = [
  {
    attendeeA: { id: "1", name: "Alice", gender: Gender.FEMALE, sexuality: Sexuality.HETEROSEXUAL, age: 25 },
    attendeeB: { id: "2", name: "Bob", gender: Gender.MALE, sexuality: Sexuality.HETEROSEXUAL, age: 30 },
    dateMinutesElapsed: 3,
    dateLengthMinutes: 5,
    endedEarly: false,
  },
];

describe("ActiveDatesTable", () => {
  it("renders pair names", () => {
    render(<ActiveDatesTable pairs={pairs} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows progress text", () => {
    render(<ActiveDatesTable pairs={pairs} />);
    expect(screen.getByText("3/5m")).toBeInTheDocument();
  });

  it("shows empty state when no pairs", () => {
    render(<ActiveDatesTable pairs={[]} />);
    expect(screen.getByText("No active dates this round")).toBeInTheDocument();
  });
});
