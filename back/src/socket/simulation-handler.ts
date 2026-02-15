import type { Namespace, Socket } from "socket.io";
import type { SimulationConfig, SimulationResult } from "@site-unseen/shared";
import { SimulationMode, SimulationStatus } from "@site-unseen/shared";
import { PrismaClient, type Prisma } from "@prisma/client";
import { SimulationRunner } from "../engine/simulation-runner.js";
import { generateAttendees } from "../engine/attendee-generator.js";
import { aggregateResults } from "../engine/results-aggregator.js";

const prisma = new PrismaClient();

interface ActiveSimulation {
  runner: SimulationRunner;
  interval: ReturnType<typeof setInterval> | null;
  result: Omit<SimulationResult, "id"> | null;
}

const activeSimulations = new Map<string, ActiveSimulation>();

function roomName(simulationId: string): string {
  return `sim:${simulationId}`;
}

export function registerSimulationHandlers(nsp: Namespace): void {
  nsp.on("connection", (socket: Socket) => {
    console.log(`[simulation] Viewer connected: ${socket.id}`);

    socket.on("simulation:join", async (data: { simulationId: string }) => {
      const { simulationId } = data;
      const room = roomName(simulationId);

      await socket.join(room);
      console.log(`[simulation] ${socket.id} joined ${room}`);

      // Send snapshot if simulation is active
      const active = activeSimulations.get(simulationId);
      if (active) {
        if (active.result) {
          socket.emit("simulation:completed", active.result);
        } else {
          socket.emit("simulation:tick", active.runner.getLastTick());
        }
        return;
      }

      // Check if simulation is already completed in DB
      const sim = await prisma.simulation.findUnique({
        where: { id: simulationId },
        include: { result: true },
      });

      if (sim?.status === SimulationStatus.COMPLETED && sim.result) {
        socket.emit("simulation:completed", sim.result);
      }
    });

    socket.on("simulation:leave", async (data: { simulationId: string }) => {
      const room = roomName(data.simulationId);
      await socket.leave(room);
      console.log(`[simulation] ${socket.id} left ${room}`);
    });

    socket.on("simulation:start", async (data: { simulationId: string }) => {
      const { simulationId } = data;

      if (activeSimulations.has(simulationId)) {
        socket.emit("simulation:error", { message: "Simulation is already running" });
        return;
      }

      try {
        const sim = await prisma.simulation.findUnique({
          where: { id: simulationId },
        });

        if (!sim) {
          socket.emit("simulation:error", { message: "Simulation not found" });
          return;
        }

        if (sim.status !== SimulationStatus.PENDING) {
          socket.emit("simulation:error", { message: `Simulation is ${sim.status}, cannot start` });
          return;
        }

        const config: SimulationConfig = {
          name: sim.name,
          mode: sim.mode as SimulationMode,
          eventLengthMinutes: sim.eventLengthMinutes,
          dateLengthMinutes: sim.dateLengthMinutes,
          breakLengthMinutes: sim.breakLengthMinutes,
          attendeeCount: sim.attendeeCount,
        };

        const attendees = generateAttendees({
          simulationId,
          count: config.attendeeCount,
        });

        // Save attendees to DB
        await prisma.attendee.createMany({
          data: attendees,
        });

        // Update simulation status
        await prisma.simulation.update({
          where: { id: simulationId },
          data: { status: SimulationStatus.RUNNING },
        });

        const runner = new SimulationRunner(simulationId, config, attendees);
        const room = roomName(simulationId);

        nsp.to(room).emit("simulation:started", { simulationId, config, attendees });

        if (config.mode === SimulationMode.QUICK) {
          // Run instantly
          runner.runQuick();
          const result = await completeSimulation(simulationId, runner, nsp);
          activeSimulations.set(simulationId, { runner, interval: null, result });
        } else {
          // Detailed mode: tick every 1 second
          const active: ActiveSimulation = { runner, interval: null, result: null };
          activeSimulations.set(simulationId, active);

          active.interval = setInterval(async () => {
            const tick = runner.tick();
            nsp.to(room).emit("simulation:tick", tick);

            if (runner.isFinished()) {
              if (active.interval) {
                clearInterval(active.interval);
                active.interval = null;
              }
              active.result = await completeSimulation(simulationId, runner, nsp);
            }
          }, 1000);
        }
      } catch (err) {
        console.error(`[simulation] Error starting ${simulationId}:`, err);
        socket.emit("simulation:error", {
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[simulation] Viewer disconnected: ${socket.id}`);
    });
  });
}

async function completeSimulation(
  simulationId: string,
  runner: SimulationRunner,
  nsp: Namespace,
): Promise<Omit<SimulationResult, "id">> {
  const dates = runner.getCompletedDates();
  const attendees = runner.getAttendees();
  const result = aggregateResults(simulationId, runner.getCurrentRound(), attendees, dates);

  const room = roomName(simulationId);

  try {
    // Save dates to DB
    if (dates.length > 0) {
      await prisma.simulatedDate.createMany({ data: dates });
    }

    // Save result to DB
    await prisma.simulationResult.create({
      data: {
        ...result,
        resultData: result.resultData as Prisma.InputJsonValue,
      },
    });

    // Update simulation status
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: SimulationStatus.COMPLETED },
    });
  } catch (err) {
    console.error(`[simulation] Error saving results for ${simulationId}:`, err);
  }

  nsp.to(room).emit("simulation:completed", result);
  console.log(`[simulation] ${simulationId} completed — ${dates.length} dates, ${runner.getCurrentRound()} rounds`);

  return result;
}
