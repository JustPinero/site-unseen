import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import simulationsRouter from "./routes/simulations.js";
import { errorHandler } from "./middleware/error-handler.js";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

const app = express();

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Routes
app.use("/api/v1", healthRouter);
app.use("/api/v1", simulationsRouter);

// Error handling
app.use(errorHandler);

export default app;
