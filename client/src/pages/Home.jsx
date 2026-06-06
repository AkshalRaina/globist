import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBar from '../components/StatusBar.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [regions, setRegions] = useState([]);
  const [reels, setReels] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, reelRes, agRes] = await Promise.all([
          api.get('/regions').catch(() => ({ data: [] })),
          api.get('/reels/trending').catch(() => ({ data: [] })),
          api.get('/agencies').catch(() => ({ data: [] })),
        ]);
        setRegions(regRes.data);
        setReels(reelRes.data);
        setAgencies(agRes.data);
      } catch (e) {
        console.error('Home fetch error:', e);
      }
    };
    fetchData();
  }, []);

  const trendingTopics = [
    { icon: '📍', name: 'Local Hidden Gems', count: '2.1M active explorers', bg: '#E6F1FB' },
    { icon: '🏛️', name: 'Historic Expeditions', count: '1.5M active explorers', bg: '#FEF0F0' },
    { icon: '⭐', name: 'Luxury Stays', count: '750K active explorers', bg: 'var(--yellow-light)' },
    { icon: '🥾', name: 'Treks', count: '750K active explorers', bg: '#EEEDFE' },
  ];

  const imgClass = (type) => `img-${type || 'mountain'}`;
  const tierBadge = (tier) => {
    const map = { gold: { emoji: '🥇', bg: 'var(--yellow)', color: '#000' }, silver: { emoji: '🥈', bg: '#C0C0C0', color: '#333' }, bronze: { emoji: '🥉', bg: '#CD7F32', color: '#fff' } };
    return map[tier] || map.bronze;
  };

  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const featuredRegion = regions.find(r => r.isFeatured) || regions[0];

  return (
    <div className="screen active">
      <StatusBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, background: 'var(--black)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text1)' }}>Globist</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="topbar-icon" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gray1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🔔</div>
          <div className="avatar-sm" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            {user?.name?.[0] || 'A'}
            <div className="online-dot" />
          </div>
        </div>
      </div>

      <div className="scroll-area">
        {/* Search */}
        <div className="search-bar" style={{ margin: '0 20px 14px' }}>
          <span>🔍</span>
          <input placeholder="Search destinations, agencies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Featured Region */}
        <div className="section-header">
          <div className="h3">Featured Regions</div>
          <div className="view-all" onClick={() => navigate('/explore')}>View All ✦</div>
        </div>
        {featuredRegion && (
          <div className="featured-card" onClick={() => navigate(`/region/${featuredRegion._id}`)}>
            <div className={imgClass(featuredRegion.imageType)} style={{ height: '100%' }} />
            <div className="featured-overlay">
              <div className="featured-badge">✦ FEATURED · {featuredRegion.spotCount}+ Spots</div>
              <div className="featured-title">{featuredRegion.name}</div>
              <div className="featured-sub">{featuredRegion.subLocations?.join(' · ')}</div>
            </div>
          </div>
        )}

        {/* Trending Reels */}
        <div className="section-header">
          <div className="h3">🔥 Trending Reels</div>
          <div className="view-all" onClick={() => navigate('/reels')}>See All</div>
        </div>
        <div className="hscroll" style={{ marginBottom: 20 }}>
          {reels.slice(0, 3).map((reel, i) => {
            const badge = tierBadge(reel.creatorTier);
            return (
              <div key={reel._id || i} className="reel-thumb" onClick={() => navigate('/reels')}>
                <div className={imgClass(reel.imageType)} style={{ height: '100%' }} />
                <div className="reel-thumb-overlay">
                  <div style={{ fontSize: 10, color: 'white', fontWeight: 600 }}>{reel.creatorHandle || '@explorer'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>{reel.caption?.slice(0, 25)}...</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>❤️ {formatCount(reel.likes)}</div>
                    <div style={{ background: 'var(--yellow)', color: 'black', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>Book</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 8, left: 8, background: badge.bg, borderRadius: 20, padding: '2px 7px', fontSize: 9, fontWeight: 700, color: badge.color }}>
                  {badge.emoji} {reel.creatorTier ? reel.creatorTier.charAt(0).toUpperCase() + reel.creatorTier.slice(1) : 'Bronze'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trending Topics */}
        <div className="section-header"><div className="h3">⭐ Trending Topics</div></div>
        {trendingTopics.map((topic, i) => (
          <div key={i} className="trending-item" onClick={() => navigate('/explore')}>
            <div className="trending-icon" style={{ background: topic.bg }}>{topic.icon}</div>
            <div className="trending-info">
              <div className="trending-name">{topic.name}</div>
              <div className="trending-count">{topic.count}</div>
            </div>
            <span style={{ color: 'var(--gray3)' }}>›</span>
          </div>
        ))}

        {/* Popular Agencies */}
        <div className="section-header" style={{ marginTop: 8 }}>
          <div className="h3">🏔️ Popular Agencies</div>
          <div className="view-all" onClick={() => navigate('/explore')}>View All</div>
        </div>
        <div className="hscroll" style={{ marginBottom: 20 }}>
          {agencies.slice(0, 4).map((agency, i) => (
            <div key={agency._id || i} className="trip-card" onClick={() => navigate(`/trip/${agency.trips?.[0] || agency._id}`)}>
              <div className={`trip-card-img ${imgClass(agency.imageType)}`} />
              <div className="trip-card-body">
                <div className="trip-name">{agency.name}</div>
                <div className="trip-loc">📍 {agency.location?.split(',')[1]?.trim() || agency.location}</div>
                <div className="star-row" style={{ marginTop: 8 }}>
                  <span className="star">★</span>
                  <span className="star-val">{agency.rating}</span>
                  <span className="star-count">({agency.reviewCount?.toLocaleString()})</span>
                </div>
                <div className="trip-price">₹{agency.startingPrice?.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
      <BottomNav />
    </div>
  );
}
