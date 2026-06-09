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
      <div style={{ width: 40 }} />
    </div>
  );
}
