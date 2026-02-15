import { z } from "zod";
import { SimulationMode } from "../types/index.js";

export const simulationConfigSchema = z.object({
  name: z.string().min(1).max(100),
  mode: z.nativeEnum(SimulationMode),
  eventLengthMinutes: z.number().int().min(15).max(180),
  dateLengthMinutes: z.number().int().min(2).max(15),
  breakLengthMinutes: z.number().int().min(0).max(5),
  attendeeCount: z.number().int().min(4).max(100),
});

export type SimulationConfig = z.infer<typeof simulationConfigSchema>;
