import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const categories = ['All', 'Treks', 'Luxury Stays', 'City Tours', 'Adventure'];

export default function Region() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { api } = useAuth();
  const [region, setRegion] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        if (id) {
          const res = await api.get(`/regions/${id}`);
          setRegion(res.data.region || res.data);
          setAgencies(res.data.agencies || []);
        } else {
          const regRes = await api.get('/regions');
          const r = regRes.data[0];
          setRegion(r);
          if (r?._id) {
            const detailRes = await api.get(`/regions/${r._id}`);
            setAgencies(detailRes.data.agencies || []);
          }
        }
      } catch (e) {
        // Fallback: try to load agencies directly
        try {
          const agRes = await api.get('/agencies');
          setAgencies(agRes.data);
        } catch {}
      }
    };
    fetch();
  }, [id]);

  const imgClass = (type) => `img-${type || 'mountain'}`;

  return (
    <div className="screen active">
      {/* Status bar */}
      <div className="status-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'transparent' }}>
        <span className="status-time" style={{ color: 'white' }}>9:41</span>
        <div style={{ display: 'flex', gap: 10 }}><span style={{ color: 'white' }}>🔍</span></div>
      </div>

      {/* Back button */}
      <button
        className="back-btn"
        onClick={() => navigate('/explore')}
        style={{ position: 'absolute', top: 52, left: 16, zIndex: 15 }}
      >‹</button>

      {/* Hero */}
      <div className={`region-hero ${imgClass(region?.imageType)}`} style={{ flexShrink: 0 }}>
        <div className="region-hero-overlay">
          <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>{region?.name || 'Himachal Pradesh'}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>
            {region?.spotCount || 42}+ Spots · {region?.verifiedAgencies || 12} Verified Agencies
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 20px', scrollbarWidth: 'none', flexShrink: 0, borderBottom: '1px solid var(--gray2)' }}>
        {categories.map(cat => (
          <div key={cat} className={`pill${activeFilter === cat ? ' active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</div>
        ))}
      </div>

      {/* Sort bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>↕ Sort: Popularity</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 Map View</div>
      </div>

      <div className="scroll-area">
        {agencies.map((agency, i) => (
          <div key={agency._id || i} className="agency-card" onClick={() => navigate(`/trip/${agency._id}`)}>
            <div className={`agency-img ${imgClass(agency.imageType)}`}>
              {agency.isVerified && <div className="verified-tag">✓ Verified</div>}
              <div className="agency-tag">{agency.categories?.join(' & ') || 'Adventure & Treks'}</div>
              <div className="agency-loc-tag">📍 {agency.location?.split(',')[0]}</div>
            </div>
            <div className="agency-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="agency-name">{agency.name}</div>
                <div className="star-row">
                  <span className="star">★</span>
                  <span className="star-val">{agency.rating}</span>
                  <span className="star-count">({agency.reviewCount?.toLocaleString()})</span>
                </div>
              </div>
              <div className="agency-desc">{agency.description}</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {agency.categories?.map((cat, j) => (
                  <span key={j} className="pill pill-gray" style={{ fontSize: 10 }}>{cat.toUpperCase()}</span>
                ))}
              </div>
              <div className="agency-footer">
                <div className="agency-price">Starts at <strong>₹{agency.startingPrice?.toLocaleString()}</strong></div>
                <button className="btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/trip/${agency._id}`); }}>View Plans →</button>
              </div>
            </div>
          </div>
        ))}

        {/* Custom plan CTA */}
        <div style={{ margin: '4px 20px 20px', padding: 16, background: 'var(--gray1)', borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>🕐</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 3 }}>Need a custom plan?</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>Get a quote within 24 hours.</div>
          <button className="btn-primary" style={{ background: 'var(--blue)', color: 'white' }}>Chat with Experts</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
