import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBar from '../components/StatusBar.jsx';
import BottomNav from '../components/BottomNav.jsx';

const tabs = ['Bookings', 'My Reels', 'Saved', 'Reviews'];

export default function Profile() {
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/users/profile').then(r => setProfile(r.data)).catch(() => {});
    api.get('/bookings').then(r => setBookings(r.data)).catch(() => {});
  }, []);

  const u = profile || user || {};
  const stats = u.stats || { trips: 24, followers: 1200, bookingsInspired: 38, reviews: 15 };
  const points = u.referralPoints || 2450;
  const tier = u.explorerTier || 'gold';
  const tierEmoji = { gold: '🥇', silver: '🥈', bronze: '🥉', elite: '💎' }[tier] || '🥇';

  const formatStat = (n) => {
    if (typeof n !== 'number') return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const imgClass = (type) => `img-${type || 'mountain'}`;

  return (
    <div className="screen active">
      <div className="status-bar">
        <div style={{ width: 40 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/menu')}>⚙️</span>
        </div>
      </div>
      <div className="scroll-area">
        {/* Profile hero */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{u.name?.[0] || 'A'}</div>
            <div className="profile-camera">📷</div>
          </div>
          <div className="profile-name">
            {u.name || 'Arjun Sharma'}
            {u.isVerified && <span style={{ color: 'var(--blue)', fontSize: 16 }}>✓</span>}
          </div>
          <div className="profile-loc">📍 {u.location || 'New Delhi, India'}</div>
          <div className="profile-bio">{u.bio || 'Adventure seeker and mountain lover. Exploring the hidden gems of the Himalayas one trek at a time. ⛰️🎒'}</div>
          <button className="btn-outline" style={{ width: 'auto', padding: '8px 24px', fontSize: 13, marginBottom: 16 }}>✏️ Edit Profile</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item"><div className="stat-val">{stats.trips}</div><div className="stat-label">Trips</div></div>
          <div className="stat-item"><div className="stat-val">{formatStat(stats.followers)}</div><div className="stat-label">Followers</div></div>
          <div className="stat-item"><div className="stat-val">{stats.bookingsInspired}</div><div className="stat-label">Bookings<br/>Inspired</div></div>
          <div className="stat-item"><div className="stat-val">{stats.reviews}</div><div className="stat-label">Reviews</div></div>
        </div>

        {/* Wallet card */}
        <div className="wallet-card">
          <div className="wallet-top">
            <div>
              <div className="wallet-label">Referral Points</div>
              <div className="wallet-points">{points.toLocaleString()}</div>
              <div className="wallet-sub">≈ ₹{points.toLocaleString()} off your next booking</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div className="wallet-badge">{tierEmoji} {tier.charAt(0).toUpperCase() + tier.slice(1)} Explorer</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{stats.bookingsInspired} bookings inspired</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>
            {50 - stats.bookingsInspired} more bookings to Elite Explorer
          </div>
          <div className="wallet-progress">
            <div className="wallet-progress-fill" style={{ width: `${(stats.bookingsInspired / 50) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 10, marginTop: 2 }}>
            <span>Gold · {stats.bookingsInspired}</span><span>Elite · 50</span>
          </div>
          <div className="wallet-actions">
            <div className="wallet-action-btn">💰 Redeem Points</div>
            <div className="wallet-action-btn">📊 My Earnings</div>
            <div className="wallet-action-btn">📤 Share</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {tabs.map(tab => (
            <div key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
          ))}
        </div>

        {/* Upcoming journeys */}
        <div className="section-header" style={{ marginTop: 12 }}>
          <div className="h3">Upcoming Journeys</div>
          <div className="view-all" onClick={() => navigate('/my-trips')}>VIEW ALL</div>
        </div>
        {bookings.slice(0, 2).map((booking, i) => (
          <div key={booking._id || i} className="journey-card-sm" onClick={() => navigate('/my-trips')}>
            <div className={`journey-card-sm-img ${imgClass(booking.trip?.imageType || (i === 0 ? 'mountain' : 'valley'))}`} />
            <div style={{ flex: 1 }}>
              <div className="journey-card-sm-name">{booking.trip?.name || (i === 0 ? 'Manali Riverside Stay' : 'Rishikesh Rafting')}</div>
              <div className="journey-card-sm-sub">📍 {booking.trip?.region?.name || (i === 0 ? 'Himachal Pradesh' : 'Uttarakhand')} · {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Dec 12'}</div>
              <div className="journey-card-sm-sub">₹{(booking.totalAmount || 12500).toLocaleString()} · {booking.adults || 2} travelers</div>
            </div>
            <div className={`journey-status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-upcoming'}`}>
              {booking.status === 'confirmed' ? 'Confirmed' : 'Upcoming'}
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <>
            <div className="journey-card-sm" onClick={() => navigate('/my-trips')}>
              <div className="journey-card-sm-img img-mountain" />
              <div style={{ flex: 1 }}>
                <div className="journey-card-sm-name">Manali Riverside Stay</div>
                <div className="journey-card-sm-sub">📍 Himachal Pradesh · Dec 12</div>
                <div className="journey-card-sm-sub">₹12,500 · 2 travelers</div>
              </div>
              <div className="journey-status status-confirmed">Confirmed</div>
            </div>
            <div className="journey-card-sm">
              <div className="journey-card-sm-img img-valley" />
              <div style={{ flex: 1 }}>
                <div className="journey-card-sm-name">Rishikesh Rafting</div>
                <div className="journey-card-sm-sub">📍 Uttarakhand · Jan 5</div>
                <div className="journey-card-sm-sub">₹8,000 · 1 traveler</div>
              </div>
              <div className="journey-status status-upcoming">Upcoming</div>
            </div>
          </>
        )}
        <div style={{ height: 20 }} />
      </div>
      <BottomNav />
    </div>
  );
}
