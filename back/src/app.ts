import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import healthRouter from "./routes/health.js";
import simulationsRouter from "./routes/simulations.js";
import { errorHandler } from "./middleware/error-handler.js";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

const app = express();

// Trust proxy (Railway runs behind a reverse proxy)
app.set("trust proxy", 1);

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Global rate limit: 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many requests, please try again later" } },
}));

// Routes
app.use("/api/v1", healthRouter);
app.use("/api/v1", simulationsRouter);

// Error handling
app.use(errorHandler);

export default app;
