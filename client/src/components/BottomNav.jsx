import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/home', icon: '🏠', label: 'Home' },
  { path: '/reels', icon: '🎬', label: 'Reels' },
  { path: '/explore', icon: '🧭', label: 'Explore' },
  { path: '/my-trips', icon: '🗺️', label: 'Trips' },
];

export default function BottomNav({ variant = 'default' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isReels = variant === 'reels';

  return (
    <div
      className="bottom-nav"
      style={
        isReels
          ? {
              background: 'transparent',
              borderTop: 'none',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 15,
              paddingBottom: 10,
            }
          : {}
      }
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            className={`bnav-item${isActive ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span
              style={{
                fontSize: 22,
                ...(isReels && !isActive ? { filter: 'brightness(10)' } : {}),
              }}
            >
              {item.icon}
            </span>
            <div
              className="bnav-label"
              style={{
                color: isActive
                  ? 'var(--yellow)'
                  : isReels
                  ? 'rgba(255,255,255,.7)'
                  : undefined,
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
