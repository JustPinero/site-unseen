import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { SimulationMode, SimulationStatus } from "@site-unseen/shared";
import app from "../../app.js";
import prisma from "../../__mocks__/prisma.js";

// Mock prisma singleton
vi.mock("../../lib/prisma.js", () => import("../../__mocks__/prisma.js"));

// Mock engine modules so they don't run real simulation logic
vi.mock("../../engine/attendee-generator.js", () => ({
  generateAttendees: vi.fn(() => [
    {
      id: "att-1",
      simulationId: "sim-1",
      name: "Alice",
      gender: "FEMALE",
      sexuality: "HETEROSEXUAL",
      age: 28,
      ethnicity: "Caucasian",
      interests: ["hiking"],
    },
    {
      id: "att-2",
      simulationId: "sim-1",
      name: "Bob",
      gender: "MALE",
      sexuality: "HETEROSEXUAL",
      age: 30,
      ethnicity: "Asian",
      interests: ["cooking"],
    },
  ]),
}));

vi.mock("../../engine/simulation-runner.js", () => ({
  SimulationRunner: vi.fn().mockImplementation(() => ({
    runQuick: vi.fn(),
    getCompletedDates: vi.fn(() => []),
    getCurrentRound: vi.fn(() => 3),
  })),
}));

vi.mock("../../engine/results-aggregator.js", () => ({
  aggregateResults: vi.fn(() => ({
    simulationId: "sim-1",
    totalRounds: 3,
    totalDatesCompleted: 6,
    totalEarlyExits: 1,
    averageDatesPerAttendee: 3,
    resultData: {},
  })),
}));

const baseSim = {
  id: "sim-1",
  name: "Test Sim",
  mode: SimulationMode.DETAILED,
  status: SimulationStatus.PENDING,
  eventLengthMinutes: 60,
  dateLengthMinutes: 5,
  breakLengthMinutes: 1,
  attendeeCount: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const validConfig = {
  name: "Test Sim",
  mode: SimulationMode.DETAILED,
  eventLengthMinutes: 60,
  dateLengthMinutes: 5,
  breakLengthMinutes: 1,
  attendeeCount: 20,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/v1/simulations", () => {
  it("creates a DETAILED simulation and returns 201", async () => {
    prisma.simulation.create.mockResolvedValue(baseSim);
    prisma.attendee.createMany.mockResolvedValue({ count: 2 });
    prisma.simulation.findUnique.mockResolvedValue({
      ...baseSim,
      attendees: [],
    });

    const res = await request(app)
      .post("/api/v1/simulations")
      .send(validConfig);

    expect(res.status).toBe(201);
    expect(prisma.simulation.create).toHaveBeenCalled();
    expect(prisma.attendee.createMany).toHaveBeenCalled();
  });

  it("creates a QUICK simulation, runs it, and returns results", async () => {
    prisma.simulation.create.mockResolvedValue({
      ...baseSim,
      mode: SimulationMode.QUICK,
    });
    prisma.attendee.createMany.mockResolvedValue({ count: 2 });
    prisma.simulationResult.create.mockResolvedValue({});
    prisma.simulation.update.mockResolvedValue({
      ...baseSim,
      status: SimulationStatus.COMPLETED,
    });
    prisma.simulation.findUnique.mockResolvedValue({
      ...baseSim,
      mode: SimulationMode.QUICK,
      status: SimulationStatus.COMPLETED,
      attendees: [],
      result: { totalRounds: 3 },
    });

    const res = await request(app)
      .post("/api/v1/simulations")
      .send({ ...validConfig, mode: SimulationMode.QUICK });

    expect(res.status).toBe(201);
  });

  it("returns 400 for invalid config", async () => {
    const res = await request(app)
      .post("/api/v1/simulations")
      .send({ name: "" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/simulations", () => {
  it("returns paginated simulation list", async () => {
    prisma.simulation.findMany.mockResolvedValue([baseSim]);
    prisma.simulation.count.mockResolvedValue(1);

    const res = await request(app).get("/api/v1/simulations");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      total: 1,
    });
  });

  it("accepts page and limit params", async () => {
    prisma.simulation.findMany.mockResolvedValue([]);
    prisma.simulation.count.mockResolvedValue(0);

    const res = await request(app).get("/api/v1/simulations?page=2&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.limit).toBe(5);
  });

  it("filters by valid status", async () => {
    prisma.simulation.findMany.mockResolvedValue([]);
    prisma.simulation.count.mockResolvedValue(0);

    const res = await request(app).get("/api/v1/simulations?status=COMPLETED");

    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid status filter", async () => {
    const res = await request(app).get("/api/v1/simulations?status=INVALID");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for invalid mode filter", async () => {
    const res = await request(app).get("/api/v1/simulations?mode=INVALID");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/simulations/:id", () => {
  it("returns simulation when found", async () => {
    prisma.simulation.findUnique.mockResolvedValue({
      ...baseSim,
      attendees: [],
      result: null,
    });

    const res = await request(app).get("/api/v1/simulations/sim-1");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("sim-1");
  });

  it("returns 404 when not found", async () => {
    prisma.simulation.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/simulations/nonexistent");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("DELETE /api/v1/simulations/:id", () => {
  it("deletes a PENDING simulation", async () => {
    prisma.simulation.findUnique.mockResolvedValue(baseSim);
    prisma.simulation.delete.mockResolvedValue(baseSim);

    const res = await request(app).delete("/api/v1/simulations/sim-1");

    expect(res.status).toBe(204);
    expect(prisma.simulation.delete).toHaveBeenCalledWith({ where: { id: "sim-1" } });
  });

  it("returns 400 for non-PENDING simulation", async () => {
    prisma.simulation.findUnique.mockResolvedValue({
      ...baseSim,
      status: SimulationStatus.RUNNING,
    });

    const res = await request(app).delete("/api/v1/simulations/sim-1");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_STATE");
  });

  it("returns 404 when not found", async () => {
    prisma.simulation.findUnique.mockResolvedValue(null);

    const res = await request(app).delete("/api/v1/simulations/nonexistent");

    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/simulations/:id/results", () => {
  it("returns results for completed simulation", async () => {
    prisma.simulation.findUnique.mockResolvedValue(baseSim);
    prisma.simulationResult.findUnique.mockResolvedValue({
      id: "result-1",
      simulationId: "sim-1",
      totalRounds: 3,
      totalDatesCompleted: 6,
      totalEarlyExits: 1,
      averageDatesPerAttendee: 3,
      resultData: {},
    });

    const res = await request(app).get("/api/v1/simulations/sim-1/results");

    expect(res.status).toBe(200);
    expect(res.body.totalRounds).toBe(3);
  });

  it("returns 404 when simulation not found", async () => {
    prisma.simulation.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/simulations/nope/results");

    expect(res.status).toBe(404);
  });

  it("returns 404 when results not available", async () => {
    prisma.simulation.findUnique.mockResolvedValue(baseSim);
    prisma.simulationResult.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/simulations/sim-1/results");

    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/simulations/:id/dates", () => {
  it("returns dates for simulation", async () => {
    prisma.simulation.findUnique.mockResolvedValue(baseSim);
    prisma.simulatedDate.findMany.mockResolvedValue([
      { id: "date-1", roundNumber: 1 },
    ]);

    const res = await request(app).get("/api/v1/simulations/sim-1/dates");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("returns 404 when simulation not found", async () => {
    prisma.simulation.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/simulations/nope/dates");

    expect(res.status).toBe(404);
  });
});
