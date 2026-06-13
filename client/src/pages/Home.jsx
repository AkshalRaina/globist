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
  const [searchResults, setSearchResults] = useState(null);

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

  // Live search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/explore/search?q=${encodeURIComponent(search)}`);
        setSearchResults(res.data);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const trendingTopics = [
    { icon: '💎', name: 'Local Hidden Gems', count: '2.1M active explorers', bg: '#E6F1FB', category: null },
    { icon: '🏛️', name: 'Historic Expeditions', count: '1.5M active explorers', bg: '#FEF0F0', category: 'City Tours' },
    { icon: '🥂', name: 'Luxury Stays', count: '750K active explorers', bg: 'var(--yellow-light)', category: 'Luxury Stays' },
    { icon: '🥾', name: 'Treks', count: '750K active explorers', bg: '#EEEDFE', category: 'Treks' },
    { icon: '🏄', name: 'Adventure', count: '1.2M active explorers', bg: '#E8F5E9', category: 'Adventure' },
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

  const handleTopicClick = (topic) => {
    if (topic.category) {
      // Navigate to a region list filtered by that category
      // Use the first featured region as a starting point
      const region = regions.find(r => r.isFeatured) || regions[0];
      if (region) {
        navigate(`/region/${region._id}?category=${encodeURIComponent(topic.category)}`);
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/explore');
    }
  };

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
          {search && (
            <span onClick={() => setSearch('')} style={{ fontSize: 16, cursor: 'pointer', color: 'var(--text3)' }}>✕</span>
          )}
        </div>

        {/* Search Results */}
        {searchResults && (
          <div style={{ padding: '0 20px 20px' }}>
            <div className="h3" style={{ marginBottom: 12 }}>Search Results</div>
            {searchResults.regions?.map(r => (
              <div key={r._id} onClick={() => navigate(`/region/${r._id}`)} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <div className={imgClass(r.imageType)} style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.spotCount}+ spots · Region</div>
                </div>
              </div>
            ))}
            {searchResults.agencies?.map(a => (
              <div key={a._id} onClick={() => navigate(`/trip/${a._id}`)} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <div className={imgClass(a.imageType)} style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>★ {a.rating} · {a.location} · Agency</div>
                </div>
              </div>
            ))}
            {searchResults.trips?.map(t => (
              <div key={t._id} onClick={() => navigate(`/trip/${t.agency?._id || t._id}`)} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <div className={imgClass(t.imageType)} style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>₹{t.pricePerPerson?.toLocaleString()} · {t.duration}D · Trip</div>
                </div>
              </div>
            ))}
            {(!searchResults.regions?.length && !searchResults.agencies?.length && !searchResults.trips?.length) && (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No results found for "{search}"</div>
            )}
          </div>
        )}

        {/* Featured Destinations (horizontal scroll) */}
        {!searchResults && (
          <>
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="h1">Featured<br/>Destinations</div>
            </div>
            <div className="hscroll" style={{ marginBottom: 32, gap: 14, paddingLeft: 20 }}>
              {regions.filter(r => r.isFeatured).map((region, i) => (
                <div key={region._id || i} className="featured-card" onClick={() => navigate(`/region/${region._id}`)} style={{ height: 260, width: 220, flexShrink: 0, borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  <div className={imgClass(region.imageType)} style={{ height: '100%', transform: 'scale(1.05)', transition: 'transform 10s linear' }} />
                  <div className="featured-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)', padding: 16 }}>
                    <div className="featured-badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: 'none', fontSize: 9 }}>✦ FEATURED</div>
                    <div className="featured-title" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>{region.name}</div>
                    <div className="featured-sub" style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{region.subLocations?.slice(0, 3).join(' · ')}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending Reels */}
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="h2">🔥 Trending Reels</div>
            </div>
            <div className="hscroll" style={{ marginBottom: 20 }}>
              {reels.slice(0, 3).map((reel, i) => {
                const badge = tierBadge(reel.creatorTier);
                return (
                  <div key={reel._id || i} className="reel-thumb">
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
                <div key={i} className="bento-card" style={{ background: topic.bg }} onClick={() => handleTopicClick(topic)}>
                  <div className="bento-icon"><span style={{ display: 'inline-block', fontSize: 24 }}>{topic.icon}</span></div>
                  <div>
                    <div className="bento-title">{topic.name}</div>
                    <div className="bento-sub">{topic.count}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* All Regions Grid */}
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="h2">🗺️ All Regions</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px', marginBottom: 24 }}>
              {regions.map((region, i) => (
                <div key={region._id || i} onClick={() => navigate(`/region/${region._id}`)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', background: 'white' }}>
                  <div className={imgClass(region.imageType)} style={{ height: 100 }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>{region.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{region.spotCount}+ spots · {region.verifiedAgencies} agencies</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Agencies */}
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="h2">🏔️ Top Agencies</div>
            </div>
            <div className="hscroll" style={{ marginBottom: 20 }}>
              {agencies.slice(0, 6).map((agency, i) => (
                <div key={agency._id || i} className="trip-card" onClick={() => navigate(`/trip/${agency._id}`)}>
                  <div className={`trip-card-img ${imgClass(agency.imageType)}`} />
                  <div className="trip-card-body">
                    <div className="trip-name">{agency.name}</div>
                    <div className="trip-loc">📍 {agency.location?.split(',')[0]}</div>
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
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
