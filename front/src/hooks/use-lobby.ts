import { useEffect, useCallback, useRef } from "react";
import type { Simulation } from "@site-unseen/shared";
import { lobbySocket } from "../socket";

interface LobbySimulationUpdate {
  simulation: Simulation;
}

interface LobbyViewerCount {
  simulationId: string;
  viewerCount: number;
}

interface UseLobbyCallbacks {
  onSimulationUpdate: (simulation: Simulation) => void;
  onViewerCount: (simulationId: string, viewerCount: number) => void;
}

export function useLobby(callbacks: UseLobbyCallbacks): void {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const handleSimulationUpdate = useCallback((data: LobbySimulationUpdate) => {
    callbacksRef.current.onSimulationUpdate(data.simulation);
  }, []);

  const handleViewerCount = useCallback((data: LobbyViewerCount) => {
    callbacksRef.current.onViewerCount(data.simulationId, data.viewerCount);
  }, []);

  useEffect(() => {
    lobbySocket.connect();
    lobbySocket.emit("lobby:subscribe");

    lobbySocket.on("connect", () => {
      lobbySocket.emit("lobby:subscribe");
    });

    lobbySocket.on("lobby:simulation-update", handleSimulationUpdate);
    lobbySocket.on("lobby:viewer-count", handleViewerCount);

    return () => {
      lobbySocket.off("lobby:simulation-update", handleSimulationUpdate);
      lobbySocket.off("lobby:viewer-count", handleViewerCount);
      lobbySocket.disconnect();
    };
  }, [handleSimulationUpdate, handleViewerCount]);
}
