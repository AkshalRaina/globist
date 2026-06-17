import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const REEL_VIDEOS = ['/reel.mp4', '/reel2.mp4', '/reel3.mp4', '/reel4.mp4'];

const formatCount = (n) => {
  if (!n) return '0';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const getTierBadgeProps = (tier) => {
  const map = { 
    diamond: { icon: '💎', label: 'Diamond', bg: 'linear-gradient(135deg, #b9f2ff, #71c6ff)', color: '#003a5c', border: '1px solid #b9f2ff', shadow: '0 0 8px rgba(113, 198, 255, 0.6)' },
    gold: { icon: '🥇', label: 'Gold', bg: 'linear-gradient(135deg, #FFE44D, #FFB300)', color: '#4A3500', border: '1px solid #FFE44D', shadow: '0 0 8px rgba(255, 179, 0, 0.6)' },
    silver: { icon: '🥈', label: 'Silver', bg: 'linear-gradient(135deg, #F5F5F5, #BDBDBD)', color: '#2B2B2B', border: '1px solid #F5F5F5', shadow: '0 0 8px rgba(189, 189, 189, 0.6)' },
    bronze: { icon: '🥉', label: 'Bronze', bg: 'linear-gradient(135deg, #E0A96D, #8B4513)', color: '#4A2500', border: '1px solid #E0A96D', shadow: '0 0 8px rgba(224, 169, 109, 0.6)' }
  };
  
  return map[tier?.toLowerCase()] || map.gold;
};

const ReelItem = ({ reel, isActive, handleLike, isLiked, openComments, openShare, openOptions, index }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isActive) {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(error => console.log("Autoplay prevented:", error));
      }
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', scrollSnapAlign: 'start', position: 'relative', flexShrink: 0 }} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      
      {/* Dark gradient overlay for text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 15 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, paddingLeft: 6 }}>
            ▶
          </div>
        </div>
      )}

      {/* Mute toggle button */}
      <div 
        onClick={toggleMute}
        style={{ position: 'absolute', top: 22, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 25, cursor: 'pointer' }}
      >
        {isMuted ? '🔇' : '🔊'}
      </div>

      {/* Side actions */}
      <div style={{ position: 'absolute', right: 12, bottom: 130, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7a9b,#2a5a7a)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 8, cursor: 'pointer', overflow: 'hidden' }}>
          {reel.creatorPic ? (
             <img src={reel.creatorPic} alt="Creator" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
             reel.creatorHandle?.[1]?.toUpperCase() || 'E'
          )}
        </div>
        {[
          { 
            icon: isLiked ? '❤️' : '♡', 
            label: formatCount(reel.likes), 
            onClick: () => handleLike(index),
            style: isLiked ? { color: '#ff3040', filter: 'none' } : {}
          },
          { icon: '💬', label: formatCount(reel.comments), onClick: () => openComments(reel) },
          { icon: '↗️', label: formatCount(reel.shares), onClick: () => openShare(reel) },
          { icon: '⋮', label: '', onClick: () => openOptions(reel) },
        ].map((action, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div
              onClick={(e) => { e.stopPropagation(); action.onClick?.(); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: action.icon === '⋮' ? 22 : 26, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))', transition: 'transform 0.1s', ...action.style }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {action.icon}
            </div>
            {action.label && <div style={{ fontSize: 12, color: 'white', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{action.label}</div>}
          </div>
        ))}
      </div>

      {/* Affiliated Book Button */}
      <div 
        onClick={(e) => { e.stopPropagation(); navigate('/trip/1'); }}
        style={{ 
          position: 'absolute', bottom: 160, left: 16, zIndex: 10,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 24,
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
      >
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #ff7b02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, boxShadow: '0 2px 8px rgba(245,166,35,0.4)' }}>
          ✈️
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>Book This Trip</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 500, letterSpacing: '0.5px' }}>Himalayan Trips</span>
        </div>
        <span style={{ color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 18, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>›</span>
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 40, left: 16, right: 70, zIndex: 5 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.5)', flexWrap: 'wrap' }}>
          {reel.creatorHandle || '@explorer'}
          
          {/* Tier Badge */}
          {(() => {
             const badge = getTierBadgeProps(reel.creatorTier);
             return (
               <span style={{ 
                 fontSize: 10, display: 'flex', alignItems: 'center', gap: 2, 
                 background: badge.bg, color: badge.color, 
                 padding: '2px 6px', borderRadius: 10, fontWeight: 800, textTransform: 'uppercase',
                 border: badge.border, boxShadow: badge.shadow, textShadow: 'none', letterSpacing: '0.5px'
               }}>
                 <span style={{ fontSize: 12 }}>{badge.icon}</span> {badge.label}
               </span>
             );
          })()}

          <span 
            onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
            style={{ 
              fontSize: 12, fontWeight: 600, color: isFollowing ? 'black' : 'white', 
              background: isFollowing ? 'white' : 'transparent', 
              border: '1px solid white', borderRadius: 4, padding: '3px 8px', 
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              textShadow: 'none'
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </span>
        </div>
        <div style={{ fontSize: 14, color: 'white', lineHeight: 1.4, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{reel.caption}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 13, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ animation: 'spin 3s linear infinite', display: 'inline-block' }}>🎵</span> {reel.musicTitle || 'Original Audio - @explorer'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Reels() {
  const { api } = useAuth();
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedReels, setLikedReels] = useState(new Set());
  
  // Modals state
  const [activeCommentsReel, setActiveCommentsReel] = useState(null);
  const [activeShareReel, setActiveShareReel] = useState(null);
  const [activeOptionsReel, setActiveOptionsReel] = useState(null);
  const [savedReels, setSavedReels] = useState(new Set());
  
  const containerRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    api.get('/reels').then(r => {
      let fetched = r.data.reels || r.data;
      if (!fetched || fetched.length === 0) {
        fetched = Array(4).fill(null).map((_, i) => ({
          _id: `dummy-${i}`,
          creatorHandle: `@wanderer_${i+1}`,
          caption: 'Exploring the beautiful mountains! 🏔️ #nature #travel #explore',
          likes: Math.floor(Math.random() * 5000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
        }));
      }
      const processed = fetched.map((reel, i) => {
        const tiers = ['diamond', 'gold', 'silver', 'bronze'];
        return {
          ...reel,
          creatorTier: reel.creatorTier || tiers[i % 4],
          videoUrl: REEL_VIDEOS[i % REEL_VIDEOS.length]
        };
      });
      setReels(processed);
    }).catch(() => {
      const fetched = Array(4).fill(null).map((_, i) => ({
        _id: `dummy-${i}`,
        creatorHandle: `@wanderer_${i+1}`,
        caption: 'Exploring the beautiful mountains! 🏔️ #nature #travel #explore',
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
      }));
      const processed = fetched.map((reel, i) => {
        const tiers = ['diamond', 'gold', 'silver', 'bronze'];
        return {
          ...reel,
          creatorTier: reel.creatorTier || tiers[i % 4],
          videoUrl: REEL_VIDEOS[i % REEL_VIDEOS.length]
        };
      });
      setReels(processed);
    });
  }, [api]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    if (scrollTop + clientHeight * 2 >= scrollHeight) {
      setReels(prev => {
        const newReels = Array(4).fill(null).map((_, i) => {
          const baseReel = prev[(prev.length + i) % prev.length] || prev[0];
          const tiers = ['diamond', 'gold', 'silver', 'bronze'];
          return {
            ...baseReel,
            _id: `appended-${Date.now()}-${i}`,
            creatorTier: tiers[i % 4],
            videoUrl: REEL_VIDEOS[(prev.length + i) % REEL_VIDEOS.length]
          };
        });
        return [...prev, ...newReels];
      });
    }
  };

  const handleLike = async (index) => {
    const reel = reels[index];
    if (!reel) return;
    
    const isCurrentlyLiked = likedReels.has(reel._id);
    
    // Optimistic UI update
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) newSet.delete(reel._id);
      else newSet.add(reel._id);
      return newSet;
    });

    setReels(prev => prev.map((r, i) => i === index ? { ...r, likes: Math.max(0, (r.likes || 0) + (isCurrentlyLiked ? -1 : 1)) } : r));

    try {
      if (!reel._id.startsWith('dummy') && !reel._id.startsWith('appended')) {
         await api.post(`/reels/${reel._id}/like`);
      }
    } catch {}
  };

  const toggleSaveReel = () => {
    if (!activeOptionsReel) return;
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activeOptionsReel._id)) newSet.delete(activeOptionsReel._id);
      else newSet.add(activeOptionsReel._id);
      return newSet;
    });
    setActiveOptionsReel(null); // Close modal
  };

  if (reels.length === 0) {
    return (
      <div className="screen active" style={{ background: '#000', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          Loading reels...
        </div>
      </div>
    );
  }

  return (
    <div className="screen active" style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
      {/* Top Status Bar like IG */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div onClick={() => navigate('/home')} style={{ fontSize: 28, color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))', cursor: 'pointer', pointerEvents: 'auto' }}>←</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Reels</div>
        <div style={{ width: 36 }}></div> {/* Spacer to balance back button */}
      </div>

      {/* Full screen vertical scroll container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        style={{ 
          height: '100dvh',
          width: '100%', 
          overflowY: 'scroll', 
          scrollSnapType: 'y mandatory', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}
        className="hide-scrollbar"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        
        {reels.map((reel, i) => (
          <ReelItem 
            key={i} 
            index={i}
            reel={reel} 
            isActive={i === activeIndex} 
            isLiked={likedReels.has(reel._id)}
            handleLike={handleLike}
            openComments={setActiveCommentsReel}
            openShare={setActiveShareReel}
            openOptions={setActiveOptionsReel}
          />
        ))}
      </div>

      {/* Comments Bottom Sheet Modal */}
      {activeCommentsReel && (
        <>
          <div 
            onClick={() => setActiveCommentsReel(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(2px)' }} 
          />
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', 
            background: '#222', borderRadius: '24px 24px 0 0', zIndex: 50,
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2 }} />
            </div>
            <div style={{ padding: '0 16px 16px', textAlign: 'center', borderBottom: '1px solid #333', fontWeight: 'bold', color: 'white', fontSize: 16 }}>
              Comments
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { user: 'travel_junkie', text: 'Wow, this looks absolutely breathtaking! 😍', time: '2h' },
                { user: 'mountain.explorer', text: 'Added this to my bucket list immediately! Where exactly is this spot?', time: '4h' },
                { user: 'photo_nomad', text: 'The lighting here is just perfect. Great shot!', time: '5h' },
                { user: 'wanderlust_2026', text: 'I did this trip last year with Globist, best experience ever ✈️🔥', time: '1d' }
              ].map((c, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `hsl(${idx * 40 + 100}, 60%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 16, flexShrink: 0 }}>
                    {c.user[0].toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{c.user}</span>
                      <span style={{ color: '#888', fontSize: 12 }}>{c.time}</span>
                    </div>
                    <div style={{ color: '#eee', fontSize: 14, lineHeight: 1.4 }}>{c.text}</div>
                    <div style={{ color: '#888', fontSize: 12, fontWeight: 600, marginTop: 4, cursor: 'pointer' }}>Reply</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#888', cursor: 'pointer' }}>♡</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #333', display: 'flex', gap: 12, alignItems: 'center', background: '#222' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7a9b,#2a5a7a)', flexShrink: 0 }} />
              <input 
                type="text" 
                placeholder={`Add a comment for ${activeCommentsReel.creatorHandle}...`}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 20, border: '1px solid #444', background: '#111', color: 'white', outline: 'none', fontSize: 14 }} 
              />
              <button style={{ background: 'transparent', border: 'none', color: '#3897f0', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>Post</button>
            </div>
          </div>
        </>
      )}

      {/* Share Bottom Sheet Modal */}
      {activeShareReel && (
        <>
          <div 
            onClick={() => setActiveShareReel(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(2px)' }} 
          />
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', 
            background: '#222', borderRadius: '24px 24px 0 0', zIndex: 50,
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2 }} />
            </div>
            
            {/* Friends horizontal scroll */}
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, borderBottom: '1px solid #333', scrollbarWidth: 'none' }}>
              {['Alex', 'Sarah_T', 'Mike99', 'Emma.Explore', 'John_D', 'Jessica'].map((name, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: `hsl(${i * 60}, 50%, 40%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, flexShrink: 0, border: '2px solid transparent' }}>
                    {name[0]}
                  </div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{name}</div>
                </div>
              ))}
            </div>

            {/* Apps Grid */}
            <div style={{ display: 'flex', gap: 24, paddingTop: 20, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {[
                { name: 'WhatsApp', icon: '📱', color: '#25D366' },
                { name: 'Instagram', icon: '📸', color: '#E1306C' },
                { name: 'Copy link', icon: '🔗', color: '#666' },
                { name: 'SMS', icon: '💬', color: '#007AFF' },
                { name: 'Snapchat', icon: '👻', color: '#FFFC00', textColor: 'black' },
              ].map((app, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: app.textColor || 'white' }}>
                    {app.icon}
                  </div>
                  <div style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>{app.name}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Options (Three Dots) Bottom Sheet Modal */}
      {activeOptionsReel && (
        <>
          <div 
            onClick={() => setActiveOptionsReel(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(2px)' }} 
          />
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#222', borderRadius: '24px 24px 0 0', zIndex: 50,
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 4, background: '#444', borderRadius: 2 }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #333', paddingBottom: 20, marginBottom: 10 }}>
              <div 
                onClick={toggleSaveReel}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <div style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: savedReels.has(activeOptionsReel._id) ? 'white' : 'white', background: savedReels.has(activeOptionsReel._id) ? '#333' : 'transparent' }}>
                  {savedReels.has(activeOptionsReel._id) ? '✅' : '🔖'}
                </div>
                <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{savedReels.has(activeOptionsReel._id) ? 'Saved' : 'Save'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white' }}>👁️</div>
                <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>Not interested</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#ff3b30' }}>⚠️</div>
                <div style={{ fontSize: 12, color: '#ff3b30', fontWeight: 500 }}>Report</div>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveOptionsReel(null)}
              style={{ padding: '16px 0', textAlign: 'center', color: 'white', fontSize: 16, cursor: 'pointer' }}
            >
              Cancel
            </div>
          </div>
        </>
      )}
    </div>
  );
}

