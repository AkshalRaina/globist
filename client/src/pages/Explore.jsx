import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import BottomNav from '../components/BottomNav.jsx';

// Mock destinations with compass bearings (0-360 degrees) and distances
const destinations = [
  { id: '1', name: 'Ladakh', bearing: 0, distance: '1,000 km' },
  { id: '2', name: 'Manali', bearing: 30, distance: '550 km' },
  { id: '3', name: 'Kasol', bearing: 45, distance: '500 km' },
  { id: '4', name: 'Darjeeling', bearing: 90, distance: '1,400 km' },
  { id: '5', name: 'Andaman', bearing: 135, distance: '2,500 km' },
  { id: '6', name: 'Goa', bearing: 180, distance: '1,500 km' },
  { id: '7', name: 'Kerala', bearing: 225, distance: '2,000 km' },
  { id: '8', name: 'Jaipur', bearing: 270, distance: '250 km' },
  { id: '9', name: 'Amritsar', bearing: 315, distance: '400 km' },
];

export default function Explore() {
  const navigate = useNavigate();
  
  // High-performance MotionValue for 60fps tracking without React re-renders
  const rawHeading = useMotionValue(0);
  
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(true); // Always show start button for user gesture
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const hasAbsolute = useRef(false); // Tracks if we have true earth-relative data

  // Smooth the heading using a framer-motion spring for buttery physics
  // Softened the spring for less jitter and more weight
  const smoothHeading = useSpring(rawHeading, { stiffness: 30, damping: 20, mass: 0.8 });
  
  // Rotate the compass dial opposite to the heading so North always points up when phone points North
  const dialRotation = useTransform(smoothHeading, (h) => -h);

  useEffect(() => {
    // We intentionally don't auto-start. Modern browsers require a user gesture.
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, []);

  // Standard W3C formula to extract True Compass Bearing from 3D Euler angles
  const calculateCompassHeading = (alpha, beta, gamma) => {
    const _x = beta * (Math.PI / 180);
    const _y = gamma * (Math.PI / 180);
    const _z = alpha * (Math.PI / 180);

    const cX = Math.cos(_x);
    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Fallback if device is perfectly flat
    if (Vx === 0 && Vy === 0) return 360 - alpha;

    let compassHeading = Math.atan(Vx / Vy);

    if (Vy < 0) {
      compassHeading += Math.PI;
    } else if (Vx < 0) {
      compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI);
  };

  const handleOrientation = (event) => {
    // Do not fight the user if they are manually dragging the dial
    if (isDragging.current) return;

    let heading;
    
    // iOS provides webkitCompassHeading directly (True North)
    if (event.webkitCompassHeading !== undefined) {
      heading = event.webkitCompassHeading;
    } 
    // Android Absolute Orientation
    else {
      // Prioritize True North. If we see absolute data, block the relative fallback data.
      if (event.absolute === true || event.type === 'deviceorientationabsolute') {
        hasAbsolute.current = true;
      } else if (hasAbsolute.current) {
        return; // Ignore this relative event
      }

      if (event.alpha !== null && event.alpha !== undefined) {
        // Run the 3D tilt compensation math
        heading = calculateCompassHeading(event.alpha, event.beta || 0, event.gamma || 0);
      }
    }

    if (heading !== undefined) {
      const current = rawHeading.get();
      
      // Calculate the shortest angular distance
      let diff = heading - current;
      diff = ((diff + 180) % 360 + 360) % 360 - 180;
      
      // Only update if the device moved more than 3 degrees (eliminates micro-jitter)
      if (Math.abs(diff) >= 3) {
        // Accumulate continuously to prevent the physics engine from doing a 360 wrap-around reverse spin
        rawHeading.set(current + diff);
      }
    }
  };

  const requestPermissionAndStart = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          startCompass();
          setPermissionGranted(true);
        } else {
          alert('Compass permission denied. You can still swipe to rotate.');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Non-iOS or older devices (Android)
      startCompass();
      setPermissionGranted(true);
    }
    setNeedsPermission(false);
  };

  const startCompass = () => {
    // Absolute device orientation if available
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    // Fallback standard device orientation
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  // Bulletproof native pointer events for manual dragging
  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - lastX.current;
    lastX.current = clientX;
    
    const current = rawHeading.get();
    // Accumulate continuously, do not modulo 360
    rawHeading.set(current - deltaX * 0.5);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Calculate the shortest angular distance between two angles
  const getRelativeAngle = (bearing, heading) => {
    let diff = bearing - heading;
    // Normalize difference to between -180 and 180
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    return diff;
  };

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

      <div style={{ position: 'absolute', top: 100, left: 20, right: 20, zIndex: 10, textAlign: 'center' }}>
        <div className="h2" style={{ color: 'var(--text1)' }}>Point your phone</div>
        <div className="body2" style={{ color: 'var(--text3)' }}>Discover spots around you</div>
      </div>

      {/* The Destinations (Popups) */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', zIndex: 5, width: 0, height: 0 }}>
        {destinations.map((dest) => {
          // Calculate dynamic position based on current heading
          // We use Framer Motion's useTransform to smoothly react to smoothHeading changes
          const x = useTransform(smoothHeading, (h) => {
            const relAngle = getRelativeAngle(dest.bearing, h);
            // Convert to radians
            const rad = relAngle * (Math.PI / 180);
            // Radius of the circle where popups appear (in px)
            const radius = 140; 
            return Math.sin(rad) * radius;
          });

          const y = useTransform(smoothHeading, (h) => {
            const relAngle = getRelativeAngle(dest.bearing, h);
            const rad = relAngle * (Math.PI / 180);
            const radius = 140;
            // Negative cos because Y goes down in CSS, but we want 0 deg to go UP
            return -Math.cos(rad) * radius;
          });

          // Scale and Opacity: Items in front (0 deg relative) are large and opaque.
          // Items behind (>90 deg relative) shrink and fade out.
          const scale = useTransform(smoothHeading, (h) => {
            const relAngle = Math.abs(getRelativeAngle(dest.bearing, h));
            if (relAngle < 40) return 1.1; // Focused
            if (relAngle < 90) return 0.8; // Peripheral
            return 0; // Behind you
          });

          const opacity = useTransform(smoothHeading, (h) => {
            const relAngle = Math.abs(getRelativeAngle(dest.bearing, h));
            if (relAngle < 60) return 1;
            if (relAngle < 90) return 0.4;
            return 0;
          });

          return (
            <motion.div
              key={dest.id}
              className="compass-bubble"
              style={{
                x,
                y,
                scale,
                opacity,
                // Center the transform origin
                translateX: '-50%',
                translateY: '-50%',
                pointerEvents: 'auto',
              }}
              onClick={() => navigate('/trip')}
            >
              <div className="bubble-title">{dest.name}</div>
              <div className="bubble-sub">📍 {dest.distance}</div>
            </motion.div>
          );
        })}
      </div>

      {/* The Central Compass Dial */}
      <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 10, touchAction: 'none' }}>
        <motion.div 
          className="compass-dial-container"
          style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
        >
        {/* The rotating graphic */}
        <motion.div style={{ width: '100%', height: '100%', position: 'absolute', rotate: dialRotation }}>
          <div className="compass-tick" style={{ top: 10 }}>N</div>
          <div className="compass-tick" style={{ top: '50%', right: 10, left: 'auto', transform: 'translateY(-50%)' }}>E</div>
          <div className="compass-tick" style={{ bottom: 10, top: 'auto' }}>S</div>
          <div className="compass-tick" style={{ top: '50%', left: 10, transform: 'translateY(-50%)' }}>W</div>
          
          {/* Decorative tick marks */}
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 2, height: 10,
              background: 'var(--gray2)',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-130px)`
            }} />
          ))}
        </motion.div>

        {/* Static center dot */}
        <div className="compass-center" />
        </motion.div>
      </div>

      {/* Permission Overlay for iOS */}
      {needsPermission && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🧭</div>
          <div className="h2" style={{ textAlign: 'center', marginBottom: 10 }}>Calibrate Compass</div>
          <div className="body2" style={{ textAlign: 'center', marginBottom: 30 }}>
            Globist needs access to your device's orientation to show destinations around you in real-time.
          </div>
          <button className="btn-primary" onClick={requestPermissionAndStart}>
            Start Radar
          </button>
        </div>
      )}

      {/* Desktop Helper text */}
      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: 'var(--text3)', zIndex: 5 }}>
        Tip: Swipe left/right on the dial to rotate manually
      </div>

      <BottomNav />
    </div>
  );
}
