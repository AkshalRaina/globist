import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import BottomNav from '../components/BottomNav.jsx';

// ── Destinations with true compass bearings ──
const destinations = [
  { id: '1', name: 'Ladakh', bearing: 0, distance: '1,000 km', emoji: '🏔️' },
  { id: '2', name: 'Manali', bearing: 30, distance: '550 km', emoji: '⛰️' },
  { id: '3', name: 'Kasol', bearing: 45, distance: '500 km', emoji: '🌲' },
  { id: '4', name: 'Darjeeling', bearing: 90, distance: '1,400 km', emoji: '🍵' },
  { id: '5', name: 'Andaman', bearing: 135, distance: '2,500 km', emoji: '🏝️' },
  { id: '6', name: 'Goa', bearing: 180, distance: '1,500 km', emoji: '🏖️' },
  { id: '7', name: 'Kerala', bearing: 225, distance: '2,000 km', emoji: '🌴' },
  { id: '8', name: 'Jaipur', bearing: 270, distance: '250 km', emoji: '🏰' },
  { id: '9', name: 'Amritsar', bearing: 315, distance: '400 km', emoji: '🛕' },
];

// ── Low-pass filter for angular values (handles 0°/360° wrap) ──
// Inspired by react-world-compass and SO best-practices for compass smoothing
const filterAngle = (newAngle, oldAngle, factor = 0.15) => {
  let diff = newAngle - oldAngle;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (oldAngle + diff * factor + 360) % 360;
};

// ── Shortest angular distance between two bearings ──
const angularDiff = (a, b) => {
  let d = a - b;
  d = ((d + 180) % 360 + 360) % 360 - 180;
  return d;
};

// ── Individual Destination Bubble (uses hooks at top level — no rules violation) ──
function DestinationBubble({ dest, smoothHeading, onTap }) {
  const x = useTransform(smoothHeading, (h) => {
    const rel = angularDiff(dest.bearing, h);
    return Math.sin(rel * Math.PI / 180) * 140;
  });

  const y = useTransform(smoothHeading, (h) => {
    const rel = angularDiff(dest.bearing, h);
    return -Math.cos(rel * Math.PI / 180) * 140;
  });

  const scale = useTransform(smoothHeading, (h) => {
    const absRel = Math.abs(angularDiff(dest.bearing, h));
    if (absRel < 40) return 1.1;
    if (absRel < 90) return 0.75;
    return 0;
  });

  const opacity = useTransform(smoothHeading, (h) => {
    const absRel = Math.abs(angularDiff(dest.bearing, h));
    if (absRel < 50) return 1;
    if (absRel < 90) return 0.3;
    return 0;
  });

  return (
    <motion.div
      className="compass-bubble"
      style={{ x, y, scale, opacity, translateX: '-50%', translateY: '-50%', pointerEvents: 'auto' }}
      onClick={onTap}
    >
      <div style={{ fontSize: 18, marginBottom: 2 }}>{dest.emoji}</div>
      <div className="bubble-title">{dest.name}</div>
      <div className="bubble-sub">📍 {dest.distance}</div>
    </motion.div>
  );
}

export default function Explore() {
  const navigate = useNavigate();

  // ── Core heading state ──
  // We use a MotionValue so Framer Motion can drive animations without React re-renders
  const rawHeading = useMotionValue(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(true);
  const [headingDisplay, setHeadingDisplay] = useState(0);

  // Refs for sensor logic (no re-renders needed)
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const hasAbsoluteOrientation = useRef(false);
  const filteredHeading = useRef(0);
  const animFrameId = useRef(null);

  // ── Smoothed heading via Framer Motion spring ──
  // Tuned for a heavy, damped feel — like a real compass needle with inertia
  const smoothHeading = useSpring(rawHeading, { stiffness: 40, damping: 25, mass: 1.2 });

  // Rotate the dial graphic opposite to heading (so N always points toward real North)
  const dialRotation = useTransform(smoothHeading, (h) => -h);

  // Human-readable cardinal direction
  const cardinalDirection = useMemo(() => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(((headingDisplay % 360) + 360) % 360 / 45) % 8;
    return dirs[idx];
  }, [headingDisplay]);

  // ── Sensor event handler ──
  const handleOrientation = useCallback((event) => {
    if (isDragging.current) return;

    let heading;

    // iOS Safari provides webkitCompassHeading (true north, pre-calibrated)
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      heading = event.webkitCompassHeading;
    }
    // Android/Chrome — prefer absolute orientation events
    else if (event.alpha !== null && event.alpha !== undefined) {
      if (event.absolute === true || event.type === 'deviceorientationabsolute') {
        hasAbsoluteOrientation.current = true;
      } else if (hasAbsoluteOrientation.current) {
        return; // Skip relative events if we have absolute
      }

      // W3C tilt-compensated compass heading formula
      const alpha = event.alpha;
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      const _x = beta * Math.PI / 180;
      const _y = gamma * Math.PI / 180;
      const _z = alpha * Math.PI / 180;

      const cX = Math.cos(_x), cY = Math.cos(_y), cZ = Math.cos(_z);
      const sX = Math.sin(_x), sY = Math.sin(_y), sZ = Math.sin(_z);

      const Vx = -cZ * sY - sZ * sX * cY;
      const Vy = -sZ * sY + cZ * sX * cY;

      if (Vx === 0 && Vy === 0) {
        heading = 360 - alpha;
      } else {
        let compassH = Math.atan2(Vx, Vy);
        if (compassH < 0) compassH += 2 * Math.PI;
        heading = compassH * 180 / Math.PI;
      }
    }

    if (heading === undefined) return;

    // Apply low-pass filter to eliminate sensor jitter
    filteredHeading.current = filterAngle(heading, filteredHeading.current, 0.15);

    // Update the MotionValue using continuous accumulation
    // This prevents the spring from doing a 359° -> 1° reverse spin
    const current = rawHeading.get();
    let diff = filteredHeading.current - (((current % 360) + 360) % 360);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) >= 1.5) {
      rawHeading.set(current + diff);
    }

    // Update display heading (throttled via rAF)
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(() => {
        setHeadingDisplay(Math.round(((rawHeading.get() % 360) + 360) % 360));
        animFrameId.current = null;
      });
    }
  }, [rawHeading]);

  // ── Start compass sensors ──
  const startCompass = useCallback(() => {
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  // ── Permission flow ──
  const requestPermissionAndStart = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          startCompass();
          setPermissionGranted(true);
        } else {
          alert('Compass permission denied. You can still swipe to rotate.');
        }
      } catch (e) {
        console.error('Permission error:', e);
      }
    } else {
      // Android or older browsers — no permission needed
      startCompass();
      setPermissionGranted(true);
    }
    setNeedsPermission(false);
  }, [startCompass]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [handleOrientation]);

  // ── Pointer/touch drag handlers ──
  // We only use pointer events (not touch events) to prevent double-firing on mobile
  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    lastPointerX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    rawHeading.set(rawHeading.get() - deltaX * 0.6);
  }, [rawHeading]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="screen active" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Background Grid */}
      <div className="radar-bg" />
      <div className="radar-overlay" />

      {/* Top Status */}
      <div className="status-bar" style={{ background: 'transparent', backdropFilter: 'none', zIndex: 20 }}>
        <div style={{ width: 40 }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text1)' }}>Radar</div>
        <div className="topbar-icon" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--white)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
      </div>

      {/* Heading display */}
      <div style={{ position: 'absolute', top: 90, left: 20, right: 20, zIndex: 10, textAlign: 'center' }}>
        <div className="h2" style={{ color: 'var(--text1)' }}>Point your phone</div>
        <div className="body2" style={{ color: 'var(--text3)', marginBottom: 8 }}>Discover spots around you</div>
        {!needsPermission && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(252,128,25,0.08)', border: '1px solid rgba(252,128,25,0.2)',
            borderRadius: 20, padding: '4px 14px',
          }}>
            <span style={{ fontSize: 20 }}>🧭</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--swiggy-orange)', fontVariantNumeric: 'tabular-nums' }}>
              {headingDisplay}°
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>
              {cardinalDirection}
            </span>
          </div>
        )}
      </div>

      {/* Destination Bubbles */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', zIndex: 5, width: 0, height: 0 }}>
        {destinations.map((dest) => (
          <DestinationBubble
            key={dest.id}
            dest={dest}
            smoothHeading={smoothHeading}
            onTap={() => navigate('/trip')}
          />
        ))}
      </div>

      {/* Central Compass Dial */}
      <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 10, touchAction: 'none' }}>
        <motion.div
          className="compass-dial-container"
          style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Rotating dial graphic */}
          <motion.div style={{ width: '100%', height: '100%', position: 'absolute', rotate: dialRotation }}>
            {/* Cardinal directions */}
            <div className="compass-tick" style={{ top: 10, color: '#e74c3c', fontSize: 16 }}>N</div>
            <div className="compass-tick" style={{ top: '50%', right: 10, left: 'auto', transform: 'translateY(-50%)' }}>E</div>
            <div className="compass-tick" style={{ bottom: 10, top: 'auto' }}>S</div>
            <div className="compass-tick" style={{ top: '50%', left: 10, transform: 'translateY(-50%)' }}>W</div>

            {/* Tick marks every 30° */}
            {[...Array(36)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 14 : 8,
                background: i % 3 === 0 ? 'var(--swiggy-orange)' : 'var(--gray2)',
                transform: `translate(-50%, -50%) rotate(${i * 10}deg) translateY(-130px)`,
                borderRadius: 1,
              }} />
            ))}

            {/* North indicator triangle */}
            <div style={{
              position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
              borderBottom: '8px solid #e74c3c',
            }} />
          </motion.div>

          {/* Static center dot */}
          <div className="compass-center" />
        </motion.div>
      </div>

      {/* Permission Overlay */}
      {needsPermission && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 30,
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🧭</div>
          <div className="h2" style={{ textAlign: 'center', marginBottom: 10 }}>Calibrate Compass</div>
          <div className="body2" style={{ textAlign: 'center', marginBottom: 30, maxWidth: 280 }}>
            Globist needs access to your device's orientation to show destinations around you in real-time.
          </div>
          <button className="btn-primary" onClick={requestPermissionAndStart}>
            Start Radar
          </button>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 16, textAlign: 'center' }}>
            On desktop? Click "Start" then swipe the dial
          </div>
        </div>
      )}

      {/* Desktop helper */}
      {!needsPermission && (
        <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: 'var(--text3)', zIndex: 5 }}>
          Drag the dial to explore · On mobile, point your phone
        </div>
      )}

      <BottomNav />
    </div>
  );
}
