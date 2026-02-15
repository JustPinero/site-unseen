import type { Namespace, Socket } from "socket.io";
import type { Attendee, Simulation, SimulationConfig, SimulationResult } from "@site-unseen/shared";
import { SimulationMode, SimulationStatus } from "@site-unseen/shared";
import { PrismaClient, type Prisma } from "@prisma/client";
import { SimulationRunner } from "../engine/simulation-runner.js";
import { aggregateResults } from "../engine/results-aggregator.js";
import { broadcastSimulationUpdate, broadcastViewerCount } from "./lobby-handler.js";

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

async function emitViewerCount(nsp: Namespace, simulationId: string): Promise<void> {
  const room = roomName(simulationId);
  const sockets = await nsp.in(room).fetchSockets();
  broadcastViewerCount(simulationId, sockets.length);
}

function toSimulation(row: {
  id: string;
  name: string;
  status: string;
  mode: string;
  eventLengthMinutes: number;
  dateLengthMinutes: number;
  breakLengthMinutes: number;
  attendeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}): Simulation {
  return {
    id: row.id,
    name: row.name,
    status: row.status as SimulationStatus,
    mode: row.mode as SimulationMode,
    eventLengthMinutes: row.eventLengthMinutes,
    dateLengthMinutes: row.dateLengthMinutes,
    breakLengthMinutes: row.breakLengthMinutes,
    attendeeCount: row.attendeeCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function registerSimulationHandlers(nsp: Namespace): void {
  nsp.on("connection", (socket: Socket) => {
    console.log(`[simulation] Viewer connected: ${socket.id}`);

    socket.on("simulation:join", async (data: { simulationId: string }) => {
      const { simulationId } = data;
      const room = roomName(simulationId);

      await socket.join(room);
      console.log(`[simulation] ${socket.id} joined ${room}`);

      // Broadcast updated viewer count to lobby
      await emitViewerCount(nsp, simulationId);

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

      // Broadcast updated viewer count to lobby
      await emitViewerCount(nsp, data.simulationId);
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

        // Load attendees created by POST /api/v1/simulations
        const dbAttendees = await prisma.attendee.findMany({
          where: { simulationId },
        });
        const attendees: Attendee[] = dbAttendees.map((a) => ({
          ...a,
          gender: a.gender as Attendee["gender"],
          sexuality: a.sexuality as Attendee["sexuality"],
        }));

        if (attendees.length === 0) {
          socket.emit("simulation:error", { message: "No attendees found for this simulation" });
          return;
        }

        // Update simulation status
        const updatedSim = await prisma.simulation.update({
          where: { id: simulationId },
          data: { status: SimulationStatus.RUNNING },
        });

        // Broadcast to lobby that this simulation is now running
        broadcastSimulationUpdate(toSimulation(updatedSim));

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

    socket.on("disconnecting", () => {
      // Broadcast updated viewer counts for all rooms this socket was in
      for (const room of socket.rooms) {
        if (room.startsWith("sim:")) {
          const simulationId = room.slice(4);
          // After disconnect the count will be one less
          nsp.in(room).fetchSockets().then((sockets) => {
            broadcastViewerCount(simulationId, Math.max(0, sockets.length - 1));
          });
        }
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
    const completedSim = await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: SimulationStatus.COMPLETED },
    });

    // Broadcast to lobby that this simulation completed
    broadcastSimulationUpdate(toSimulation(completedSim));
  } catch (err) {
    console.error(`[simulation] Error saving results for ${simulationId}:`, err);
  }

  nsp.to(room).emit("simulation:completed", result);
  console.log(`[simulation] ${simulationId} completed — ${dates.length} dates, ${runner.getCurrentRound()} rounds`);

  return result;
}
