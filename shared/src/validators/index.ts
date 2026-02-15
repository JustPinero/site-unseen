import { z } from "zod";
import { SimulationMode } from "../types/index.js";

export const simulationConfigSchema = z.object({
  name: z.string().min(1).max(100),
  mode: z.nativeEnum(SimulationMode),
  attendeeCount: z.number().int().min(4).max(200),
  roundDurationMinutes: z.number().int().min(1).max(30),
  totalRounds: z.number().int().min(1).max(50),
});

export type SimulationConfig = z.infer<typeof simulationConfigSchema>;
