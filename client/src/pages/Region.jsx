import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const categories = ['All', 'Treks', 'Luxury Stays', 'City Tours', 'Adventure'];

export default function Region() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { api } = useAuth();
  const [region, setRegion] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);

  const fetchRegionData = async (category) => {
    try {
      setLoading(true);
      if (id) {
        const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
        const res = await api.get(`/regions/${id}${params}`);
        setRegion(res.data.region || res.data);
        setAgencies(res.data.agencies || []);
        setTrips(res.data.trips || []);
      } else {
        const regRes = await api.get('/regions');
        const r = regRes.data[0];
        setRegion(r);
        if (r?._id) {
          const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
          const detailRes = await api.get(`/regions/${r._id}${params}`);
          setAgencies(detailRes.data.agencies || []);
          setTrips(detailRes.data.trips || []);
        }
      }
    } catch (e) {
      try {
        const agRes = await api.get('/agencies');
        setAgencies(agRes.data);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionData(activeFilter);
  }, [id]);

  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    fetchRegionData(cat);
  };

  const imgClass = (type) => `img-${type || 'mountain'}`;

  return (
    <div className="screen active">
      {/* Back button */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        style={{ position: 'absolute', top: 16, left: 16, zIndex: 15 }}
      >‹</button>

      {/* Hero */}
      <div className={`region-hero ${imgClass(region?.imageType)}`} style={{ flexShrink: 0 }}>
        <div className="region-hero-overlay">
          <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{region?.name || 'Loading...'}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', marginTop: 4 }}>
            {region?.spotCount || 0}+ Spots · {region?.verifiedAgencies || 0} Verified Agencies
          </div>
          {region?.description && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginTop: 6, lineHeight: 1.4 }}>
              {region.description}
            </div>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 20px', scrollbarWidth: 'none', flexShrink: 0, borderBottom: '1px solid var(--gray2)' }}>
        {categories.map(cat => (
          <div key={cat} className={`pill${activeFilter === cat ? ' active' : ''}`} onClick={() => handleFilterChange(cat)}>{cat}</div>
        ))}
      </div>

      {/* Sort bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>
          {agencies.length} {activeFilter === 'All' ? 'agencies' : activeFilter.toLowerCase()} found
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>↕ Sort: Rating</div>
      </div>

      <div className="scroll-area">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            Loading...
          </div>
        ) : agencies.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No results for "{activeFilter}"</div>
            <div style={{ fontSize: 12 }}>Try a different category</div>
          </div>
        ) : (
          agencies.map((agency, i) => (
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
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
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
          ))
        )}

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
