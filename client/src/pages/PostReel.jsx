import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const availableTags = ['#Himachal', '#Manali', '#Trekking', '#Adventure', '#Mountains'];

export default function PostReel() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [caption, setCaption] = useState('Waking up to the serene peaks of Manali. The air is different up here. ⛰️ #Himachal #RoamFlow');
  const [location, setLocation] = useState('Manali, Himachal Pradesh');
  const [selectedTags, setSelectedTags] = useState(['#Himachal', '#Manali', '#Trekking']);
  const [isAffiliate, setIsAffiliate] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      await api.post('/reels', {
        caption,
        location,
        tags: selectedTags,
        isAffiliate,
        imageType: 'mountain',
      });
    } catch (e) {
      // Continue anyway for demo
    }
    setLoading(false);
    navigate('/profile');
  };

  return (
    <div className="screen active">
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text1)', cursor: 'pointer' }} onClick={() => navigate(-1)}>✕</div>
      </div>
      <div style={{ padding: '0 20px 12px', borderBottom: '1px solid var(--gray1)' }}>
        <div className="h3">Post Your Trip Reel 🎬</div>
        <div className="body2">Share your experience · Tag agency · Earn points</div>
      </div>
      <div className="scroll-area">
        <div style={{ padding: '16px 20px 0' }}>
          {/* Upload area */}
          <div style={{
            marginBottom: 20, height: 200, border: '2px dashed var(--gray2)',
            borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'var(--gray1)',
            transition: 'all .2s',
          }}>
            <div style={{ fontSize: 36 }}>🎬</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Tap to upload your reel</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>MP4 · Max 60 seconds · Min 15 seconds</div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom: 12 }}>
            <div className="input-label">Caption</div>
            <textarea
              className="input"
              style={{ height: 80, resize: 'none', lineHeight: 1.5 }}
              placeholder="Tell people about your experience..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Tag agency */}
          <div style={{ marginBottom: 12 }}>
            <div className="input-label">Tag Agency (required for referral)</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--gray1)', borderRadius: 10, padding: '12px 14px',
              border: '1.5px solid var(--yellow)',
            }}>
              <div className="img-mountain" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Himalayan High Treks</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Booking: DEC 12–18 · Manali</div>
              </div>
              <span style={{ color: 'var(--yellow)' }}>✓</span>
            </div>
          </div>

          {/* Affiliate toggle */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 14, background: 'var(--yellow-light)', borderRadius: 12,
            border: '1px solid rgba(245,166,35,.3)', marginBottom: 14,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>Set as Affiliate Reel</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Earn referral points when people book from this reel</div>
            </div>
            <div
              onClick={() => setIsAffiliate(!isAffiliate)}
              style={{
                width: 42, height: 24, borderRadius: 12,
                background: isAffiliate ? 'var(--yellow)' : 'var(--gray3)',
                position: 'relative', cursor: 'pointer', transition: 'background .2s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2,
                right: isAffiliate ? 2 : 'auto',
                left: isAffiliate ? 'auto' : 2,
                boxShadow: '0 1px 4px rgba(0,0,0,.2)', transition: 'all .2s',
              }} />
            </div>
          </div>

          {/* Earn preview */}
          {isAffiliate && (
            <div style={{
              marginBottom: 20, padding: 14, background: '#E1F5EE', borderRadius: 12,
              border: '1px solid #5DCAA5', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 28 }}>💰</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F6E56' }}>You could earn up to ₹375 per booking</div>
                <div style={{ fontSize: 12, color: '#1D9E75' }}>Based on 3% of ₹12,500 per referral booking</div>
              </div>
            </div>
          )}

          {/* Location */}
          <div style={{ marginBottom: 12 }}>
            <div className="input-label">Location</div>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 20 }}>
            <div className="input-label">Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {availableTags.map(tag => (
                <div key={tag} className={`pill${selectedTags.includes(tag) ? ' active' : ''}`} onClick={() => toggleTag(tag)}>{tag}</div>
              ))}
              <div className="pill">+ Add</div>
            </div>
          </div>

          {/* Info note */}
          <div style={{ background: 'var(--gray1)', borderRadius: 10, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
            <span>ℹ️</span>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
              Only 1 reel per booking can be your affiliate reel. You can post more reels freely — only this one earns referral points when others book from it.
            </div>
          </div>
        </div>
      </div>
      <div className="sticky-bottom">
        <button className="btn-primary" onClick={handlePost} disabled={loading}>
          {loading ? 'Posting...' : 'Post Reel & Start Earning →'}
        </button>
      </div>
    </div>
  );
}
