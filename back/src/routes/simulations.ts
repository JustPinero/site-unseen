import { Router } from "express";
import type { Prisma } from "@prisma/client";
import {
  simulationConfigSchema,
  SimulationMode,
  SimulationStatus,
} from "@site-unseen/shared";
import type { SimulationConfig } from "@site-unseen/shared";
import { validate } from "../middleware/validate.js";
import { AppError } from "../middleware/error-handler.js";
import { generateAttendees } from "../engine/attendee-generator.js";
import { SimulationRunner } from "../engine/simulation-runner.js";
import { aggregateResults } from "../engine/results-aggregator.js";
import prisma from "../lib/prisma.js";
const router = Router();

// POST /api/v1/simulations — Create a new simulation
router.post(
  "/simulations",
  validate(simulationConfigSchema),
  async (req, res, next) => {
    try {
      const config: SimulationConfig = req.body;

      const simulation = await prisma.simulation.create({
        data: {
          name: config.name,
          mode: config.mode,
          eventLengthMinutes: config.eventLengthMinutes,
          dateLengthMinutes: config.dateLengthMinutes,
          breakLengthMinutes: config.breakLengthMinutes,
          attendeeCount: config.attendeeCount,
        },
      });

      const attendees = generateAttendees({
        simulationId: simulation.id,
        count: config.attendeeCount,
      });

      await prisma.attendee.createMany({ data: attendees });

      // Quick mode: run immediately
      if (config.mode === SimulationMode.QUICK) {
        const runner = new SimulationRunner(simulation.id, config, attendees);
        runner.runQuick();

        const dates = runner.getCompletedDates();
        const resultData = aggregateResults(
          simulation.id,
          runner.getCurrentRound(),
          attendees,
          dates,
        );

        if (dates.length > 0) {
          await prisma.simulatedDate.createMany({ data: dates });
        }

        await prisma.simulationResult.create({
          data: {
            ...resultData,
            resultData: resultData.resultData as Prisma.InputJsonValue,
          },
        });

        await prisma.simulation.update({
          where: { id: simulation.id },
          data: { status: SimulationStatus.COMPLETED },
        });

        const fullSim = await prisma.simulation.findUnique({
          where: { id: simulation.id },
          include: { attendees: true, result: true },
        });

        res.status(201).json(fullSim);
        return;
      }

      // Detailed mode: return simulation with attendees, wait for Socket.io start
      const fullSim = await prisma.simulation.findUnique({
        where: { id: simulation.id },
        include: { attendees: true },
      });

      res.status(201).json(fullSim);
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/simulations — List simulations (paginated)
router.get("/simulations", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.SimulationWhereInput = {};
    if (req.query.status) {
      const status = req.query.status as string;
      if (!Object.values(SimulationStatus).includes(status as SimulationStatus)) {
        throw new AppError("VALIDATION_ERROR", `Invalid status: ${status}`);
      }
      where.status = status as SimulationStatus;
    }
    if (req.query.mode) {
      const mode = req.query.mode as string;
      if (!Object.values(SimulationMode).includes(mode as SimulationMode)) {
        throw new AppError("VALIDATION_ERROR", `Invalid mode: ${mode}`);
      }
      where.mode = mode as SimulationMode;
    }

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.simulation.count({ where }),
    ]);

    res.json({
      data: simulations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/simulations/:id — Get simulation details
router.get("/simulations/:id", async (req, res, next) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
      include: {
        attendees: true,
        result: true,
      },
    });

    if (!simulation) {
      throw new AppError("NOT_FOUND", "Simulation not found", 404);
    }

    res.json(simulation);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/simulations/:id — Delete simulation (only if PENDING)
router.delete("/simulations/:id", async (req, res, next) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
    });

    if (!simulation) {
      throw new AppError("NOT_FOUND", "Simulation not found", 404);
    }

    if (simulation.status !== SimulationStatus.PENDING) {
      throw new AppError(
        "INVALID_STATE",
        `Cannot delete simulation with status ${simulation.status}`,
      );
    }

    await prisma.simulation.delete({ where: { id: req.params.id } });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/simulations/:id/results — Get simulation results
router.get("/simulations/:id/results", async (req, res, next) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
    });

    if (!simulation) {
      throw new AppError("NOT_FOUND", "Simulation not found", 404);
    }

    const result = await prisma.simulationResult.findUnique({
      where: { simulationId: req.params.id },
    });

    if (!result) {
      throw new AppError("NOT_FOUND", "Results not available — simulation has not completed", 404);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/simulations/:id/dates — Get all dates from simulation
router.get("/simulations/:id/dates", async (req, res, next) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
    });

    if (!simulation) {
      throw new AppError("NOT_FOUND", "Simulation not found", 404);
    }

    const dates = await prisma.simulatedDate.findMany({
      where: { simulationId: req.params.id },
      include: {
        attendeeA: { select: { id: true, name: true, gender: true, sexuality: true, age: true } },
        attendeeB: { select: { id: true, name: true, gender: true, sexuality: true, age: true } },
      },
      orderBy: { roundNumber: "asc" },
    });

    res.json(dates);
  } catch (err) {
    next(err);
  }
});

export default router;
