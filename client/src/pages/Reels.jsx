import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function Reels() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/reels').then(r => setReels(r.data.reels || r.data)).catch(() => {});
  }, []);

  const reel = reels[currentIndex];
  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const tierBadge = (tier) => {
    const map = { gold: '🥇 Gold', silver: '🥈 Silver', bronze: '🥉 Bronze' };
    return map[tier] || '🥉 Bronze';
  };

  const nextReel = () => setCurrentIndex((prev) => (prev + 1) % Math.max(reels.length, 1));
  const prevReel = () => setCurrentIndex((prev) => (prev - 1 + reels.length) % Math.max(reels.length, 1));

  const handleLike = async () => {
    if (!reel) return;
    try {
      await api.post(`/reels/${reel._id}/like`);
      setReels(prev => prev.map((r, i) => i === currentIndex ? { ...r, likes: (r.likes || 0) + 1 } : r));
    } catch {}
  };

  if (!reel) {
    return (
      <div className="screen active" style={{ background: '#000', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          Loading reels...
        </div>
        <BottomNav variant="reels" />
      </div>
    );
  }

  return (
    <div className="screen active" style={{ background: '#000', position: 'relative' }}>
      {/* Status bar */}
      <div className="status-bar" style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingTop: 14 }}>
        <div style={{ width: 40 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Reels</div>
        <div style={{ fontSize: 13, color: 'white' }}>🔍</div>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', gap: 3, padding: '10px 16px 0', position: 'absolute', top: 48, left: 0, right: 0, zIndex: 5 }}>
        {reels.slice(0, 3).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: 'rgba(255,255,255,.3)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'white', borderRadius: 1, width: i < currentIndex ? '100%' : i === currentIndex ? '40%' : '0%' }} />
          </div>
        ))}
      </div>

      {/* Reel content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={nextReel}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #0a1a3a 0%, #1a3a5a 40%, #2a5a4a 100%)` }}>
          <div className={`img-${reel.imageType || 'mountain'}`} style={{ height: '100%', opacity: 0.6 }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.2) 0%, transparent 30%, transparent 50%, rgba(0,0,0,.8) 100%)' }} />

        {/* Mountain scene decoration */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '30%', left: '-20%', width: '60%', height: 0, borderLeft: '120px solid transparent', borderRight: '120px solid transparent', borderBottom: '200px solid rgba(30,60,90,.4)' }} />
          <div style={{ position: 'absolute', bottom: '30%', right: '-10%', width: '60%', height: 0, borderLeft: '100px solid transparent', borderRight: '100px solid transparent', borderBottom: '160px solid rgba(20,50,80,.5)' }} />
        </div>

        {/* Side actions */}
        <div style={{ position: 'absolute', right: 14, bottom: 120, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7a9b,#2a5a7a)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {reel.creatorHandle?.[1]?.toUpperCase() || 'M'}
          </div>
          {[
            { icon: '❤️', label: formatCount(reel.likes), onClick: handleLike },
            { icon: '💬', label: formatCount(reel.comments) },
            { icon: '↗️', label: formatCount(reel.shares) },
            { icon: '🔖', label: 'Save' },
            { icon: '🎵', label: '' },
          ].map((action, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                onClick={(e) => { e.stopPropagation(); action.onClick?.(); }}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: i === 4 ? 12 : 16 }}
              >
                {action.icon}
              </div>
              {action.label && <div style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>{action.label}</div>}
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 80, left: 16, right: 70, zIndex: 5 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {reel.creatorHandle || '@explorer'}
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--yellow)', background: 'rgba(245,166,35,.2)', border: '1px solid var(--yellow)', borderRadius: 12, padding: '2px 10px' }}>Follow</span>
            <span className="explorer-badge">{tierBadge(reel.creatorTier)}</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', lineHeight: 1.5, marginBottom: 8 }}>{reel.caption}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {reel.tags?.map((tag, i) => <span key={i} style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 500 }}>{tag}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 {reel.location}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', gap: 4 }}>🎵 {reel.musicTitle || 'Original Sound'}</div>
          </div>
        </div>
      </div>

      {/* Book now strip */}
      <div style={{ position: 'absolute', bottom: 50, left: 0, right: 0, zIndex: 10, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(16px)', padding: '10px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={`img-${reel.imageType || 'mountain'}`} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
              {reel.agency?.name || 'Himalayan High Treks'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
              Starts ₹{reel.agency?.startingPrice?.toLocaleString() || '12,500'} · ⭐ {reel.agency?.rating || '4.9'}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/trip'); }}
            style={{ background: 'var(--yellow)', color: 'var(--black)', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
          >
            Book Now →
          </button>
        </div>
      </div>

      <BottomNav variant="reels" />
    </div>
  );
}
