import type { Namespace, Socket } from "socket.io";
import type { Simulation } from "@site-unseen/shared";

let lobbyNsp: Namespace | null = null;

export interface LobbySimulationUpdate {
  simulation: Simulation;
}

export interface LobbyViewerCount {
  simulationId: string;
  viewerCount: number;
}

export function registerLobbyHandlers(nsp: Namespace): void {
  lobbyNsp = nsp;

  nsp.on("connection", (socket: Socket) => {
    console.log(`[lobby] Viewer connected: ${socket.id}`);

    socket.on("lobby:subscribe", async () => {
      await socket.join("lobby");
      console.log(`[lobby] ${socket.id} subscribed to lobby`);
    });

    socket.on("disconnect", () => {
      console.log(`[lobby] Viewer disconnected: ${socket.id}`);
    });
  });
}

export function broadcastSimulationUpdate(simulation: Simulation): void {
  if (!lobbyNsp) return;
  lobbyNsp.to("lobby").emit("lobby:simulation-update", { simulation });
}

export function broadcastViewerCount(simulationId: string, viewerCount: number): void {
  if (!lobbyNsp) return;
  lobbyNsp.to("lobby").emit("lobby:viewer-count", { simulationId, viewerCount });
}
