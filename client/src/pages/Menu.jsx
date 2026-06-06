import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBar from '../components/StatusBar.jsx';

export default function Menu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const u = user || {};

  const menuItems = [
    { icon: '👤', name: 'My Profile', onClick: () => navigate('/profile') },
    { icon: '👥', name: 'Communities', badge: 3 },
    { icon: '📖', name: 'My Bookings', onClick: () => navigate('/my-trips') },
    { icon: '🔔', name: 'Notifications', badge: 12 },
    { icon: '💰', name: 'Referral Wallet', extra: `${(u.referralPoints || 2450).toLocaleString()} pts` },
  ];

  const settingsItems = [
    { icon: '⚙️', name: 'Preferences' },
    { icon: '🛡️', name: 'Privacy & Security' },
    { icon: '❓', name: 'Help Center' },
    { icon: '↗️', name: 'Login to Another Account' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="screen active">
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text1)' }}>✕</button>
      </div>
      <div style={{ padding: '8px 20px 12px' }}><div className="h2">Menu</div></div>
      <div className="scroll-area">
        {/* User info */}
        <div className="menu-user">
          <div className="menu-avatar">
            {u.name?.[0] || 'V'}
            <div className="online-dot" style={{ position: 'absolute', bottom: 2, right: 2 }} />
          </div>
          <div>
            <div className="menu-name">{u.name || 'Varun Sharma'}</div>
            <div className="menu-level">Explorer Level 4</div>
            <div className="menu-tags">
              <div className="menu-tag mt-yellow">Himalaya Pro</div>
              <div className="menu-tag mt-green">✓ Verified</div>
            </div>
          </div>
        </div>

        {/* Main items */}
        {menuItems.map((item, i) => (
          <div key={i} className="menu-item" onClick={item.onClick}>
            <div className="menu-item-icon">{item.icon}</div>
            <div className="menu-item-name">{item.name}</div>
            {item.badge && <div className="menu-badge">{item.badge}</div>}
            {item.extra && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--yellow)', marginRight: 4 }}>{item.extra}</div>}
            <div style={{ fontSize: 16, color: 'var(--gray3)' }}>›</div>
          </div>
        ))}

        {/* Support & Settings */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '12px 20px 4px' }}>
          Support & Settings
        </div>
        {settingsItems.map((item, i) => (
          <div key={i} className="menu-item">
            <div className="menu-item-icon">{item.icon}</div>
            <div className="menu-item-name">{item.name}</div>
            <div style={{ fontSize: 16, color: 'var(--gray3)' }}>›</div>
          </div>
        ))}

        {/* Logout */}
        <div className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div className="menu-item-icon" style={{ background: '#FEF0F0' }}>🚪</div>
          <div className="menu-item-name" style={{ color: 'var(--red)' }}>Log Out</div>
          <div style={{ fontSize: 16, color: 'var(--red)' }}>›</div>
        </div>

        <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 11 }}>
          <div>Globist v1.0.0</div>
          <div>Designed for the Wandering Soul</div>
        </div>
      </div>
    </div>
  );
}
