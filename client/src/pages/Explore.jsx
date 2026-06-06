import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBar from '../components/StatusBar.jsx';
import BottomNav from '../components/BottomNav.jsx';

const categories = ['All', 'Treks', 'Luxury Stays', 'City Tours', 'Adventure', 'Spiritual'];

export default function Explore() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [regions, setRegions] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/regions').then(r => setRegions(r.data)).catch(() => {});
    api.get('/agencies').then(r => setAgencies(r.data)).catch(() => {});
  }, []);

  const imgClass = (type) => `img-${type || 'mountain'}`;

  return (
    <div className="screen active">
      <StatusBar />
      <div className="scroll-area">
        <div style={{ padding: '8px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="h2">Explore</div>
            <span>🔔</span>
          </div>
          <div className="search-bar" style={{ margin: '0 0 12px' }}>
            <span>🔍</span>
            <input placeholder="Destinations, treks, stays..." />
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <div key={cat} className={`pill${activeFilter === cat ? ' active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</div>
            ))}
          </div>
        </div>

        {/* Luxury stays banner */}
        <div
          onClick={() => navigate(`/region/${regions[0]?._id || ''}`)}
          style={{ margin: '12px 20px 20px', borderRadius: 16, overflow: 'hidden', height: 130, position: 'relative', cursor: 'pointer' }}
        >
          <div className="img-luxury" style={{ height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ background: 'var(--yellow)', color: 'black', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, width: 'fit-content', marginBottom: 6 }}>Trending Topic</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Hidden Luxury</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>Escape the ordinary in India's most exclusive retreats</div>
          </div>
        </div>

        {/* Regions grid */}
        <div className="section-header"><div className="h3">Featured Regions</div><div className="view-all">View All</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px', marginBottom: 20 }}>
          {regions.map((region, i) => (
            <div key={region._id || i} onClick={() => navigate(`/region/${region._id}`)} style={{ borderRadius: 14, overflow: 'hidden', height: 110, position: 'relative', cursor: 'pointer' }}>
              <div className={imgClass(region.imageType)} style={{ height: '100%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{region.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{region.spotCount}+ Spots</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top rated agencies */}
        <div className="section-header"><div className="h3">🏆 Top Rated Agencies</div></div>
        {agencies.slice(0, 3).map((agency, i) => (
          <div key={agency._id || i} className="trending-item" onClick={() => navigate(`/trip/${agency._id}`)}>
            <div className={`trending-icon ${imgClass(agency.imageType)}`} style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0 }} />
            <div className="trending-info">
              <div className="trending-name">
                {agency.name} {agency.isVerified && <span style={{ color: 'var(--blue)', fontSize: 10 }}>✓ Verified</span>}
              </div>
              <div className="trending-count">⭐ {agency.rating} · {agency.reviewCount?.toLocaleString()} reviews · {agency.location?.split(',')[1]?.trim()}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text1)' }}>₹{agency.startingPrice?.toLocaleString()}</div>
          </div>
        ))}
        <div style={{ height: 20 }} />
      </div>
      <BottomNav />
    </div>
  );
}
