export default function StatusBar({ light = false, transparent = false }) {
  const style = {
    ...(transparent
      ? {
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }
      : {}),
  };

  const textColor = light ? 'white' : 'var(--text1)';

  return (
    <div className="status-bar" style={style}>
      <span className="status-time" style={{ color: textColor }}>
        9:41
      </span>
      <div className="status-icons" style={{ color: textColor }}>
        📶 🔋
      </div>
    </div>
  );
}
