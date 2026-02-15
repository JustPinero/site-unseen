import { io, type Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

export const socket: Socket = io(SERVER_URL, {
  autoConnect: false,
});

export const simulationSocket: Socket = io(`${SERVER_URL}/simulation`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
