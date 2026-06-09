import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function MyTrips() {
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data)).catch(() => {});
    api.get('/users/wishlist').then(r => setWishlist(r.data)).catch(() => {});
  }, []);

  const imgClass = (type) => `img-${type || 'mountain'}`;

  // Fallback data when API returns empty
  const fallbackBookings = [
    { _id: '1', trip: { name: 'Manali Snow Expedition', imageType: 'snow' }, checkIn: '2025-12-12', checkOut: '2025-12-18', status: 'confirmed', totalAmount: 24300 },
  ];

  const fallbackWishlist = [
    { _id: '1', name: 'Solang Valley Paragliding', location: 'Manali, India', imageType: 'mountain', pricePerPerson: 80, rating: 4.9 },
    { _id: '2', name: 'Rishikesh Rafting Camp', location: 'Uttarakhand, India', imageType: 'valley', pricePerPerson: 120, rating: 4.8 },
    { _id: '3', name: 'Dharamshala Spiritual Retreat', location: 'Himachal, India', imageType: 'jungle', pricePerPerson: 210, rating: 4.7 },
  ];

  const displayBookings = bookings.length ? bookings : fallbackBookings;
  const displayWishlist = wishlist.length ? wishlist : fallbackWishlist;

  return (
    <div className="screen active">
            <div style={{ padding: '4px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="h2">My Trips</div>
        <div className="avatar-sm" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          {user?.name?.[0] || 'A'}<div className="online-dot" />
        </div>
      </div>
      <div className="scroll-area">
        {/* Active journeys */}
        <div className="section-header"><div className="h3">Active Journeys</div></div>
        <div style={{ fontSize: 13, color: 'var(--text3)', padding: '0 20px', marginBottom: 10 }}>
          You have {displayBookings.length} trips confirmed for this season.
        </div>

        {displayBookings.filter(b => b.status === 'confirmed').map((booking, i) => (
          <div key={booking._id || i} className="active-trip-card">
            <div className={imgClass(booking.trip?.imageType || 'snow')} style={{ height: '100%' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
              <div style={{ background: 'var(--green)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>✓ Confirmed</div>
            </div>
            <div className="active-trip-overlay">
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{booking.trip?.name || 'Manali Snow Expedition'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>📍 Himachal Pradesh, India</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>
                  📅 {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : 'DEC 12'} – {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : 'DEC 18'}
                </div>
                <button className="btn-sm" style={{ fontSize: 11, padding: '6px 12px' }} onClick={() => navigate('/trip')}>Details</button>
              </div>
            </div>
          </div>
        ))}

        {/* Wishlist */}
        <div className="section-header"><div className="h3">❤️ My Wishlist</div><div className="view-all">View All</div></div>
        {displayWishlist.map((item, i) => (
          <div key={item._id || i} className="wishlist-item" onClick={() => navigate('/trip')}>
            <div className={`wishlist-img ${imgClass(item.imageType)}`}>
              <div className="heart-btn">❤️</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="wishlist-name">{item.name}</div>
              <div className="wishlist-loc">📍 {item.location || item.region?.name || 'India'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="star">★</span><span className="star-val">{item.rating || 4.9}</span>
              </div>
              <div className="wishlist-price">Starts at ${item.pricePerPerson || 80}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', cursor: 'pointer' }}>Book Now ›</div>
          </div>
        ))}

        {/* Where to next CTA */}
        <div style={{ margin: '12px 20px 20px', padding: 20, background: 'var(--gray1)', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🧭</div>
          <div className="h3" style={{ marginBottom: 4 }}>Where to next?</div>
          <div className="body2" style={{ marginBottom: 16 }}>Find inspiration from our trending reels and agencies.</div>
          <button className="btn-primary" onClick={() => navigate('/reels')}>Start Discovering</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
