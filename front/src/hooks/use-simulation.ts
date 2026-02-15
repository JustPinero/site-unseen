import { useEffect, useState, useCallback, useRef } from "react";
import type { SimulationTick, SimulationResult, Attendee, SimulationConfig } from "@site-unseen/shared";
import { simulationSocket } from "../socket";

export type SimulationPhase = "idle" | "connecting" | "waiting" | "running" | "completed" | "error";

export interface SimulationState {
  phase: SimulationPhase;
  tick: SimulationTick | null;
  result: SimulationResult | null;
  attendees: Attendee[] | null;
  config: SimulationConfig | null;
  error: string | null;
  connected: boolean;
}

export interface UseSimulationReturn extends SimulationState {
  start: () => void;
  leave: () => void;
}

export function useSimulation(simulationId: string | null): UseSimulationReturn {
  const [state, setState] = useState<SimulationState>({
    phase: "idle",
    tick: null,
    result: null,
    attendees: null,
    config: null,
    error: null,
    connected: false,
  });

  const simulationIdRef = useRef(simulationId);
  simulationIdRef.current = simulationId;

  useEffect(() => {
    if (!simulationId) return;

    setState((prev) => ({ ...prev, phase: "connecting" }));

    if (!simulationSocket.connected) {
      simulationSocket.connect();
    }

    const onConnect = () => {
      setState((prev) => ({ ...prev, connected: true }));
      // Join (or re-join on reconnect)
      simulationSocket.emit("simulation:join", { simulationId: simulationIdRef.current });
      setState((prev) => ({
        ...prev,
        phase: prev.phase === "running" ? "running" : "waiting",
      }));
    };

    const onDisconnect = () => {
      setState((prev) => ({ ...prev, connected: false }));
    };

    const onStarted = (data: { simulationId: string; config: SimulationConfig; attendees: Attendee[] }) => {
      setState((prev) => ({
        ...prev,
        phase: "running",
        config: data.config,
        attendees: data.attendees,
      }));
    };

    const onTick = (tick: SimulationTick) => {
      setState((prev) => ({
        ...prev,
        phase: "running",
        tick,
      }));
    };

    const onCompleted = (result: SimulationResult) => {
      setState((prev) => ({
        ...prev,
        phase: "completed",
        result,
        tick: null,
      }));
    };

    const onError = (data: { message: string }) => {
      setState((prev) => ({
        ...prev,
        phase: "error",
        error: data.message,
      }));
    };

    simulationSocket.on("connect", onConnect);
    simulationSocket.on("disconnect", onDisconnect);
    simulationSocket.on("simulation:started", onStarted);
    simulationSocket.on("simulation:tick", onTick);
    simulationSocket.on("simulation:completed", onCompleted);
    simulationSocket.on("simulation:error", onError);

    // If already connected, join immediately
    if (simulationSocket.connected) {
      onConnect();
    }

    return () => {
      simulationSocket.off("connect", onConnect);
      simulationSocket.off("disconnect", onDisconnect);
      simulationSocket.off("simulation:started", onStarted);
      simulationSocket.off("simulation:tick", onTick);
      simulationSocket.off("simulation:completed", onCompleted);
      simulationSocket.off("simulation:error", onError);
      simulationSocket.emit("simulation:leave", { simulationId });
    };
  }, [simulationId]);

  const start = useCallback(() => {
    if (simulationId) {
      simulationSocket.emit("simulation:start", { simulationId });
    }
  }, [simulationId]);

  const leave = useCallback(() => {
    if (simulationId) {
      simulationSocket.emit("simulation:leave", { simulationId });
    }
    setState({
      phase: "idle",
      tick: null,
      result: null,
      attendees: null,
      config: null,
      error: null,
      connected: simulationSocket.connected,
    });
  }, [simulationId]);

  return { ...state, start, leave };
}
