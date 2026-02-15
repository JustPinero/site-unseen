import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { registerSimulationHandlers } from "./socket/simulation-handler.js";
import { registerLobbyHandlers } from "./socket/lobby-handler.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

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

// /lobby namespace
const lobbyNs = io.of("/lobby");
registerLobbyHandlers(lobbyNs);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});
