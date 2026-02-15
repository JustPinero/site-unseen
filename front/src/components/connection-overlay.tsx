interface ConnectionOverlayProps {
  visible: boolean;
}

export default function ConnectionOverlay({ visible }: ConnectionOverlayProps) {
  if (!visible) return null;

  return (
    <div className="sim-overlay">
      <div className="sim-overlay-content">
        <div className="sim-overlay-spinner" />
        <p>Reconnecting...</p>
      </div>
    </div>
  );
}
