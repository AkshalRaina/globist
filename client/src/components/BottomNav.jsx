import { useLocation, useNavigate } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShortsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L5.9,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.13-6.73ZM10,14.6V9.4L15,12Z"/>
  </svg>
);

const ExploreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const TripsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const navItems = [
  { path: '/home', icon: <HomeIcon />, label: 'Home' },
  { path: '/reels', icon: <ShortsIcon />, label: 'Shorts' },
  { path: '/explore', icon: <ExploreIcon />, label: 'Explore' },
  { path: '/my-trips', icon: <TripsIcon />, label: 'Trips' },
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
              background: '#0f0f0f',
              borderTop: '1px solid #222',
              position: 'relative',
              bottom: 'auto',
              left: 'auto',
              right: 'auto',
              margin: 0,
              borderRadius: 0,
              padding: '12px 0 20px 0',
              zIndex: 15,
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
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
            style={isReels ? { color: isActive ? '#fff' : '#aaa' } : {}}
          >
            <span className="bnav-icon" style={isReels ? { display: 'flex', fontSize: 24, marginBottom: 4 } : { display: 'flex', marginBottom: 2 }}>
              {item.icon}
            </span>
            <div className="bnav-label" style={isReels ? { fontSize: 10 } : {}}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
