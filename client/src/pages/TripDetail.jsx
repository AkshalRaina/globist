import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function TripDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { api } = useAuth();
  const [agency, setAgency] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(0);
  const [reels, setReels] = useState([]);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Try as agency ID first (most common from Region page)
          try {
            const res = await api.get(`/agencies/${id}`);
            setAgency(res.data.agency || res.data);
            if (res.data.trips?.length) {
              setTrips(res.data.trips);
            }
          } catch {
            // Fallback: try as trip ID
            try {
              const res = await api.get(`/trips/${id}`);
              if (res.data.trip) {
                setAgency(res.data.trip.agency);
                setTrips([res.data.trip, ...(res.data.relatedTrips || [])]);
              }
            } catch {
              // Last resort: get first agency
              const agRes = await api.get('/agencies');
              if (agRes.data[0]) {
                const res = await api.get(`/agencies/${agRes.data[0]._id}`);
                setAgency(res.data.agency || res.data);
                if (res.data.trips?.length) setTrips(res.data.trips);
              }
            }
          }
        }
        const reelRes = await api.get('/reels/trending').catch(() => ({ data: [] }));
        setReels((reelRes.data || []).slice(0, 3));
      } catch (e) {
        console.error('TripDetail error:', e);
      }
    };
    fetchData();
  }, [id]);

  const imgClass = (type) => `img-${type || 'mountain'}`;
  const a = agency || {};
  const t = trips[selectedTrip] || {};

  return (
    <div className="screen active">
      {/* Top nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '14px 16px' }}>
        <button className="back-btn" style={{ position: 'static' }} onClick={() => navigate(-1)}>‹</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)', border: 'none', fontSize: 16, cursor: 'pointer', color: 'white' }}
          >{wishlisted ? '❤️' : '♡'}</button>
          <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)', border: 'none', fontSize: 16, cursor: 'pointer', color: 'white' }}>↗</button>
        </div>
      </div>

      {/* Hero */}
      <div className={`trip-hero ${imgClass(a.imageType)}`} style={{ flexShrink: 0 }}>
        <div className="trip-hero-overlay" />
        <div className="trip-hero-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            {a.isVerified && <span style={{ background: 'var(--blue)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>✓ Verified</span>}
            <span className="pill pill-amber" style={{ fontSize: 10 }}>⭐ {a.rating || '4.9'} · {a.reviewCount?.toLocaleString() || '1,240'} reviews</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>{a.name || 'Loading...'}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 {a.location || ''}</div>
        </div>
      </div>

      <div className="scroll-area">
        {/* Trip selector — if agency has multiple trips */}
        {trips.length > 1 && (
          <div style={{ padding: '12px 20px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Available Plans</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}>
              {trips.map((trip, i) => (
                <div
                  key={trip._id || i}
                  onClick={() => { setSelectedTrip(i); setShowFullItinerary(false); }}
                  style={{
                    flexShrink: 0,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: selectedTrip === i ? 'var(--yellow)' : 'var(--gray1)',
                    color: selectedTrip === i ? '#000' : 'var(--text2)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: selectedTrip === i ? '2px solid var(--yellow)' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{trip.name}</div>
                  <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>₹{trip.pricePerPerson?.toLocaleString()} · {trip.duration}D</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray1)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Starts from</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text1)' }}>
              ₹{(t.pricePerPerson || a.startingPrice || 12500).toLocaleString()}{' '}
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text3)' }}>/person</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text3)' }}>👥 {t.activeUsers || 0} active now</div>
        </div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-item"><div className="info-item-label">Duration</div><div className="info-item-val">{t.duration || '–'} Days</div></div>
          <div className="info-item"><div className="info-item-label">Group Size</div><div className="info-item-val">{t.groupSize?.min || '–'}–{t.groupSize?.max || '–'}</div></div>
          <div className="info-item"><div className="info-item-label">Difficulty</div><div className="info-item-val" style={{ textTransform: 'capitalize' }}>{t.difficulty || '–'}</div></div>
          <div className="info-item"><div className="info-item-label">Next Slot</div><div className="info-item-val">{t.nextSlot ? new Date(t.nextSlot).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '–'}</div></div>
        </div>

        {/* Creator strip */}
        <div className="creator-strip">
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7a4a,#2a5a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Referred by @arjun.treks</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Gold Explorer · 38 bookings inspired</div>
          </div>
          <div className="explorer-badge">🥇 Gold</div>
        </div>

        {/* About */}
        <div style={{ padding: '0 20px 16px' }}>
          <div className="h3" style={{ marginBottom: 8 }}>About this trip</div>
          <div className="body2">{t.description || a.description || 'Loading trip details...'}</div>
        </div>

        {/* Categories */}
        {a.categories?.length > 0 && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {a.categories.map((cat, i) => (
                <span key={i} className="pill pill-gray" style={{ fontSize: 10 }}>{cat.toUpperCase()}</span>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        <div style={{ padding: '0 20px 16px' }}>
          <div className="h3" style={{ marginBottom: 12 }}>Itinerary</div>
          {(t.itinerary || []).slice(0, showFullItinerary ? undefined : 3).map((item, i) => (
            <div key={i} className="itinerary-item">
              <div className="itin-day">D{item.day}</div>
              <div>
                <div className="itin-title">{item.title}</div>
                <div className="itin-desc">{item.description}</div>
              </div>
            </div>
          ))}
          {(t.itinerary?.length || 0) > 3 && !showFullItinerary && (
            <div className="itinerary-item" style={{ borderBottom: 'none', cursor: 'pointer' }} onClick={() => setShowFullItinerary(true)}>
              <div className="itin-day" style={{ background: 'var(--gray1)' }}>+{t.itinerary.length - 3}</div>
              <div><div className="itin-title" style={{ color: 'var(--yellow)' }}>View full itinerary →</div></div>
            </div>
          )}
        </div>

        {/* Reels */}
        {reels.length > 0 && (
          <div style={{ padding: '0 20px 16px' }}>
            <div className="h3" style={{ marginBottom: 12 }}>Reels from travelers ✨</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {reels.map((reel, i) => (
                <div key={reel._id || i} style={{ flexShrink: 0, width: 90, height: 130, borderRadius: 10, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                  <div className={imgClass(reel.imageType)} style={{ height: '100%' }} />
                  <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 9, color: 'white', fontWeight: 600 }}>{reel.creatorHandle}</div>
                  {reel.creatorTier === 'gold' && (
                    <div style={{ position: 'absolute', top: 4, left: 4, background: 'var(--yellow)', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 6 }}>🥇</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ height: 80 }} />
      </div>

      <div className="sticky-bottom">
        <button className="btn-primary" onClick={() => navigate(`/booking/${t._id || id || ''}`)}>Book This Trip →</button>
      </div>
    </div>
  );
}
