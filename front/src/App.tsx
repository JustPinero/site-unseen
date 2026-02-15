import { useEffect, useState } from "react";
import { SimulationMode } from "@site-unseen/shared";
import { socket } from "./socket";

function App() {
  const [connected, setConnected] = useState(false);
  const [pongTime, setPongTime] = useState<number | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("pong", (data: { timestamp: number }) => {
      setPongTime(data.timestamp);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.disconnect();
    };
  }, []);

  const handlePing = () => {
    socket.emit("ping");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Site Unseen</h1>
      <p>Speed Dating Simulator</p>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Socket.io</h2>
        <p>
          Status:{" "}
          <strong style={{ color: connected ? "green" : "red" }}>
            {connected ? "Connected" : "Disconnected"}
          </strong>
        </p>
        <button onClick={handlePing} disabled={!connected}>
          Send Ping
        </button>
        {pongTime && (
          <p>Last pong: {new Date(pongTime).toLocaleTimeString()}</p>
        )}
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Shared Package</h2>
        <p>
          Simulation modes:{" "}
          {Object.values(SimulationMode).join(", ")}
        </p>
      </section>
    </div>
  );
}

export default App;
