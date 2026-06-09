import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
    { icon: <span style={{ display: 'inline-block', fontSize: 24 }}>💎</span>, name: 'Local Hidden Gems', count: '2.1M active explorers', bg: '#E6F1FB' },
    { icon: <span style={{ display: 'inline-block', fontSize: 24 }}>🏛️</span>, name: 'Historic Expeditions', count: '1.5M active explorers', bg: '#FEF0F0' },
    { icon: <span style={{ display: 'inline-block', fontSize: 24 }}>🥂</span>, name: 'Luxury Stays', count: '750K active explorers', bg: 'var(--yellow-light)' },
    { icon: <span style={{ display: 'inline-block', fontSize: 24 }}>🥾</span>, name: 'Treks', count: '750K active explorers', bg: '#EEEDFE' },
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, background: 'var(--black)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text1)' }}>Globist</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="topbar-icon" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--white)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>🔔</div>
          <div className="avatar-sm" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', width: 40, height: 40, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            {user?.name?.[0] || 'A'}
            <div className="online-dot" style={{ background: 'var(--green)', border: '2px solid white' }} />
          </div>
        </div>
      </div>

      <div className="scroll-area">
        {/* Search */}
        <div className="search-bar" style={{ margin: '0 20px 24px', padding: '16px 20px', borderRadius: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.04)', border: 'none', background: 'var(--white)' }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input placeholder="Where to next?" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 15, fontWeight: 600 }} />
        </div>

        {/* Featured Region */}
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="h1">Featured<br/>Destinations</div>
        </div>
        {featuredRegion && (
          <div className="featured-card" onClick={() => navigate(`/region/${featuredRegion._id}`)} style={{ height: 260, borderRadius: 24, margin: '0 20px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div className={imgClass(featuredRegion.imageType)} style={{ height: '100%', transform: 'scale(1.05)', transition: 'transform 10s linear' }} />
            <div className="featured-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)', padding: 24 }}>
              <div className="featured-badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: 'none' }}>✦ FEATURED</div>
              <div className="featured-title" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{featuredRegion.name}</div>
              <div className="featured-sub" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{featuredRegion.subLocations?.join(' · ')}</div>
            </div>
          </div>
        )}

        {/* Trending Reels */}
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="h2">🔥 Trending Reels</div>
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

        {/* Trending Topics (Bento Box) */}
        <div className="section-header" style={{ marginTop: 12, marginBottom: 16 }}>
          <div className="h2">⭐ Explore Topics</div>
        </div>
        <div className="hscroll" style={{ marginBottom: 32, gap: 16 }}>
          {trendingTopics.map((topic, i) => (
            <div key={i} className="bento-card" style={{ background: topic.bg }} onClick={() => navigate('/explore')}>
              <div className="bento-icon">{topic.icon}</div>
              <div>
                <div className="bento-title">{topic.name}</div>
                <div className="bento-sub">{topic.count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Agencies */}
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="h2">🏔️ Top Agencies</div>
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
