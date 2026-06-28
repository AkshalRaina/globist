import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';

const REEL_VIDEOS = ['/reel.mp4', '/reel2.mp4', '/reel3.mp4', '/reel4.mp4'];

const ReelVideo = ({ reel, isActive, isPlaying }) => {
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    if (isActive) {
      if (isPlaying) {
        videoRef.current?.play().catch(() => {});
      } else {
        videoRef.current?.pause();
      }
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive, isPlaying, reel.videoUrl]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!isScrubbing && videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const updateVideoTime = (e) => {
    if (!timelineRef.current || !videoRef.current || !videoRef.current.duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const p = x / rect.width;
    setProgress(p * 100);
    videoRef.current.currentTime = p * videoRef.current.duration;
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsScrubbing(true);
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    updateVideoTime(e);
  };

  const handlePointerMove = (e) => {
    if (isScrubbing) {
      e.stopPropagation();
      updateVideoTime(e);
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsScrubbing(false);
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const bgGradients = {
    mountain: 'linear-gradient(160deg, #0a1a3a 0%, #1a3a5a 40%, #2a5a4a 100%)',
    valley: 'linear-gradient(160deg, #1a3a2a 0%, #0a2a1a 50%, #2a4a3a 100%)',
    snow: 'linear-gradient(160deg, #2a3a5a 0%, #4a6a8a 50%, #6a8aaa 100%)',
    desert: 'linear-gradient(160deg, #4a3a1a 0%, #6a5a2a 50%, #8a7a3a 100%)',
    beach: 'linear-gradient(160deg, #0a3a5a 0%, #1a5a7a 50%, #2a7a9a 100%)',
    jungle: 'linear-gradient(160deg, #0a2a0a 0%, #1a4a1a 50%, #0a3a1a 100%)',
  };
  const grad = bgGradients[reel.imageType] || bgGradients.mountain;

  return (
    <div style={{ position: 'absolute', inset: 0, background: grad, transition: isActive ? 'none' : 'opacity 0.3s' }}>
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          loop
          muted={isMuted}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onTimeUpdate={handleTimeUpdate}
        />
      ) : reel.mediaUrl ? (
        <img src={reel.mediaUrl} alt="Reel media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className={`img-${reel.imageType || 'mountain'}`} style={{ height: '100%', opacity: 0.55 }} />
      )}
      
      {/* Dark gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 25%, transparent 50%, rgba(0,0,0,.85) 100%)', pointerEvents: 'none' }} />

      {/* Center Play Button Overlay */}
      {isActive && !isPlaying && reel.videoUrl && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 15 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, paddingLeft: 6 }}>
            ▶
          </div>
        </div>
      )}

      {/* Mute toggle button */}
      {reel.videoUrl && (
        <div 
          onClick={toggleMute}
          style={{ position: 'absolute', top: 70, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 25, cursor: 'pointer' }}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </div>
      )}

      {/* Video Timeline */}
      {reel.videoUrl && (
        <div 
          ref={timelineRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, zIndex: 40,
            cursor: 'pointer', display: 'flex', alignItems: 'flex-end', paddingBottom: 0
          }}
        >
          <div style={{ width: '100%', height: isScrubbing ? 6 : 3, background: 'rgba(255,255,255,0.3)', transition: 'height 0.2s', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#ff0000', transition: isScrubbing ? 'none' : 'width 0.1s linear' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Reels() {
  const navigate = useNavigate();
  const location = useLocation();
  const { api } = useAuth();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Touch/swipe state
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Double-tap heart animation
  const [heartAnim, setHeartAnim] = useState(null);
  const lastTapTime = useRef(0);

  // Fetch reels with cursor
  const fetchReels = useCallback(async (cursor) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const params = cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=5` : '?limit=5';
      const res = await api.get(`/reels${params}`);
      const data = res.data;
      const fetchedReels = data.reels || data;
      if (Array.isArray(fetchedReels) && fetchedReels.length > 0) {
        setReels(prev => {
          const baseIndex = cursor ? prev.length : 0;
          const newReels = fetchedReels.map((r, i) => ({
            ...r,
            videoUrl: r.videoUrl || REEL_VIDEOS[(baseIndex + i) % REEL_VIDEOS.length]
          }));
          return cursor ? [...prev, ...newReels] : newReels;
        });
        setNextCursor(data.nextCursor || null);
        setHasMore(data.hasMore ?? fetchedReels.length >= 5);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    setIsFetching(false);
  }, [api, isFetching]);

  // Refetch fresh data whenever the route is navigated to (location.key changes)
  useEffect(() => {
    setReels([]);
    setCurrentIndex(0);
    setNextCursor(null);
    setHasMore(true);
    fetchReels(null);
  }, [location.key]);

  // Pre-fetch next batch when user is 2 reels from the end
  useEffect(() => {
    if (hasMore && !isFetching && currentIndex >= reels.length - 3 && nextCursor) {
      fetchReels(nextCursor);
    }
  }, [currentIndex, reels.length, hasMore, nextCursor]);

  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const tierBadge = (tier) => {
    const map = { gold: { emoji: '🥇', label: 'Gold' }, silver: { emoji: '🥈', label: 'Silver' }, bronze: { emoji: '🥉', label: 'Bronze' } };
    return map[tier] || map.bronze;
  };

  // Navigate reels
  const goToReel = (newIndex) => {
    if (isAnimating) return;
    if (newIndex < 0) return; // Can't go before first
    // Loop back to beginning when reaching the end (TikTok behavior)
    if (newIndex >= reels.length) {
      if (hasMore && nextCursor) return; // still loading more, don't loop yet
      newIndex = 0; // seamless loop
    }
    setIsAnimating(true);
    setSwipeOffset(newIndex > currentIndex || (currentIndex === reels.length - 1 && newIndex === 0) ? -100 : 100);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setSwipeOffset(0);
      setIsAnimating(false);
      setIsPlaying(true);
    }, 500);
  };

  const handleWheel = (e) => {
    if (isAnimating) return;
    if (Math.abs(e.deltaY) > 30) {
      if (e.deltaY > 0) {
        goToReel(currentIndex + 1);
      } else {
        goToReel(currentIndex - 1);
      }
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (e) => {
    const delta = touchStartY.current - e.touches[0].clientY;
    touchDeltaY.current = delta;
    // Elastic rubber-band effect
    const maxDrag = 120;
    const clamped = Math.max(-maxDrag, Math.min(maxDrag, delta));
    const percentage = (clamped / window.innerHeight) * 100;
    setSwipeOffset(-percentage);
  };

  const handleTouchEnd = () => {
    const threshold = 60;
    if (touchDeltaY.current > threshold) {
      // Swipe up → next reel
      goToReel(currentIndex + 1);
    } else if (touchDeltaY.current < -threshold) {
      // Swipe down → prev reel
      goToReel(currentIndex - 1);
    } else {
      setSwipeOffset(0);
    }
  };

  // Handle tap (single tap = next, double tap = like)
  const handleTap = (e) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      // Double tap — like with heart animation
      handleLike();
      setHeartAnim({ x: e.clientX || e.touches?.[0]?.clientX || window.innerWidth / 2, y: e.clientY || e.touches?.[0]?.clientY || window.innerHeight / 2 });
      setTimeout(() => setHeartAnim(null), 900);
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
      setIsPlaying(prev => !prev);
    }
  };

  // Optimistic like
  const handleLike = async () => {
    const reel = reels[currentIndex];
    if (!reel) return;
    // Optimistic update
    setReels(prev => prev.map((r, i) => i === currentIndex ? { ...r, likes: (r.likes || 0) + 1, isLiked: true } : r));
    try {
      await api.post(`/reels/${reel._id}/like`);
    } catch {
      // Revert on failure
      setReels(prev => prev.map((r, i) => i === currentIndex ? { ...r, likes: Math.max(0, (r.likes || 0) - 1), isLiked: false } : r));
    }
  };

  const reel = reels[currentIndex];
  const prevReel = currentIndex > 0 ? reels[currentIndex - 1] : null;
  const nextReel = currentIndex < reels.length - 1
    ? reels[currentIndex + 1]
    : (!hasMore && reels.length > 1 ? reels[0] : null); // Loop: show first reel as next

  if (reels.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', background: '#111' }}>
        <div className="reels-mobile-container screen active" style={{ 
          width: '100%', maxWidth: 400, height: '100vh', maxHeight: 850, 
          background: '#000', position: 'relative', overflow: 'hidden', userSelect: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: 12 }}>
            <div style={{ fontSize: 32, animation: 'pulse 1.5s infinite' }}>🎬</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Loading Reels...</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Finding the best travel stories</div>
          </div>
          <BottomNav variant="reels" />
        </div>
        <style>{`
          @media (max-width: 768px) {
            .reels-mobile-container {
              max-width: 100% !important; height: 100dvh !important; max-height: none !important; border-radius: 0 !important; border: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!reel) return null;

  const badge = tierBadge(reel.creatorTier);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', background: '#111' }}>
      
      {/* Main Reels Container */}
      <div 
        className="reels-mobile-container screen active"
        onWheel={handleWheel}
        style={{ 
          width: '100%', maxWidth: 400, height: '100vh', maxHeight: 850, 
          background: '#000', position: 'relative', overflow: 'hidden', userSelect: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column'
        }}
      >
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Reels</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', display: 'flex', color: 'white' }} onClick={() => navigate('/post-reel')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </span>
        </div>
      </div>

      {/* Reel counter */}
      <div style={{ position: 'absolute', top: 50, right: 16, zIndex: 20, fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>
        {currentIndex + 1} / {reels.length}
      </div>

      {/* Reel viewport with touch swipe */}
      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
      >
        {/* Previous reel (pre-rendered) */}
        {prevReel && (
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-100 + swipeOffset}%)`, transition: isAnimating ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'none' }}>
            <ReelVideo reel={prevReel} isActive={false} isPlaying={false} />
          </div>
        )}

        {/* Current reel */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${swipeOffset}%)`, transition: isAnimating ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'none' }}>
          <ReelVideo reel={reel} isActive={true} isPlaying={isPlaying} />
        </div>

        {/* Next reel (pre-rendered) */}
        {nextReel && (
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${100 + swipeOffset}%)`, transition: isAnimating ? 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'none' }}>
            <ReelVideo reel={nextReel} isActive={false} isPlaying={false} />
          </div>
        )}

        {/* Double-tap heart animation */}
        {heartAnim && (
          <div style={{
            position: 'absolute', left: heartAnim.x - 40, top: heartAnim.y - 40, zIndex: 30,
            fontSize: 80, pointerEvents: 'none',
            animation: 'heartPop 0.8s ease-out forwards'
          }}>
            ❤️
          </div>
        )}

        {/* Side actions */}
        <div style={{ position: 'absolute', right: 12, bottom: 140, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          {/* Creator avatar */}
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${reel.creatorTier === 'gold' ? '#FFD700, #FFA500' : reel.creatorTier === 'silver' ? '#C0C0C0, #808080' : '#CD7F32, #8B4513'})`,
              border: '2.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 18, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,.4)'
            }}>
              {reel.creatorHandle?.[1]?.toUpperCase() || 'G'}
            </div>
            <div style={{
              position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
              width: 20, height: 20, borderRadius: '50%', background: 'var(--yellow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#000', border: '2px solid #000'
            }}>+</div>
          </div>

          {/* Like */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
          >
            <div style={{
              width: 46, height: 46, borderRadius: '50%',
              background: reel.isLiked ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22, transition: 'all 0.2s', transform: reel.isLiked ? 'scale(1.1)' : 'scale(1)'
            }}>
              {reel.isLiked ? '❤️' : '🤍'}
            </div>
            <div style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{formatCount(reel.likes)}</div>
          </div>

          {/* Comment */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22
            }}>💬</div>
            <div style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{formatCount(reel.comments)}</div>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22
            }}>↗️</div>
            <div style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{formatCount(reel.shares)}</div>
          </div>

          {/* Bookmark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 22
            }}>🔖</div>
          </div>

          {/* Music disc */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #333, #111)',
            border: '3px solid rgba(255,255,255,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, animation: 'spin 4s linear infinite'
          }}>🎵</div>
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 110, left: 16, right: 75, zIndex: 10 }}>
          {/* Creator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{reel.creatorHandle || '@explorer'}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: 'var(--yellow)',
              background: 'rgba(252,128,25,.15)', border: '1px solid var(--yellow)',
              borderRadius: 12, padding: '2px 10px', cursor: 'pointer'
            }}>Follow</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: reel.creatorTier === 'gold' ? 'var(--yellow)' : reel.creatorTier === 'silver' ? '#C0C0C0' : '#CD7F32',
              color: reel.creatorTier === 'gold' ? '#000' : '#fff'
            }}>{badge.emoji} {badge.label}</span>
          </div>

          {/* Caption */}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.92)', lineHeight: 1.5, marginBottom: 8 }}>{reel.caption}</div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {reel.tags?.map((tag, i) => <span key={i} style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 500 }}>{tag}</span>)}
          </div>

          {/* Location & Music */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 {reel.location}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', maxWidth: 150 }}>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 8s linear infinite' }}>🎵 {reel.musicTitle || 'Original Sound'}</span>
            </div>
          </div>
        </div>

        {/* Book now strip */}
        {reel.agency && (
          <div style={{
            position: 'absolute', bottom: 6, left: 0, right: 0, zIndex: 15,
            background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(20px)',
            padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className={`img-${reel.agency.imageType || reel.imageType || 'mountain'}`} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reel.agency.name || 'Travel Agency'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>
                  Starts ₹{reel.agency.startingPrice?.toLocaleString() || '12,500'} · ⭐ {reel.agency.rating || '4.9'}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/trip/${reel.agency._id || reel.agency}`); }}
                style={{
                  background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 10,
                  padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                  fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(252,128,25,.4)'
                }}
              >
                Book →
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav variant="reels" />
      </div>

      {/* Desktop Arrows (YouTube style - Right side) */}
      <div className="desktop-arrow-container" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginLeft: 24, zIndex: 50 }}>
        <button 
          onClick={() => goToReel(currentIndex - 1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: '50%', background: '#2a2a2a',
            color: 'white', border: 'none', cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
        <button 
          onClick={() => goToReel(currentIndex + 1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: '50%', background: '#2a2a2a',
            color: 'white', border: 'none', cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-arrow-container { display: none !important; }
          .reels-mobile-container {
            max-width: 100% !important;
            height: 100dvh !important;
            max-height: none !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
