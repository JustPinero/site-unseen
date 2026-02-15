interface ConnectionOverlayProps {
  visible: boolean;
}

export default function ConnectionOverlay({ visible }: ConnectionOverlayProps) {
  if (!visible) return null;

  return (
    <div className="sim-overlay">
      <div className="sim-overlay-content">
        <div className="sim-overlay-spinner">{"\u2764\uFE0F"}</div>
        <p>Reconnecting...</p>
      </div>
    </div>
  );
}
