import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import healthRouter from "./routes/health.js";
import { registerSimulationHandlers } from "./socket/simulation-handler.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/v1", healthRouter);

// Default namespace — ping/pong for connection testing
io.on("connection", (socket) => {
  console.log(`[io] Client connected: ${socket.id}`);

  socket.on("ping", () => {
    socket.emit("pong", { timestamp: Date.now() });
  });

  socket.on("disconnect", () => {
    console.log(`[io] Client disconnected: ${socket.id}`);
  });
});

// /simulation namespace
const simulationNs = io.of("/simulation");
registerSimulationHandlers(simulationNs);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});
