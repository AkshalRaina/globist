import { useState, useEffect, useRef, useCallback } from 'react';

// Low-pass filter for angular values (handles 0°/360° wrap)
const filterAngle = (newAngle, oldAngle, factor = 0.15) => {
  if (oldAngle === null) return newAngle;
  let diff = newAngle - oldAngle;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (oldAngle + diff * factor + 360) % 360;
};

export const useCompass = () => {
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'requesting', 'granted', 'denied', 'unsupported'
  const [needsPermission, setNeedsPermission] = useState(true);
  
  const rawHeadingRef = useRef(null);
  const animFrameId = useRef(null);

  const setFilteredHeading = useCallback((newHeading) => {
    rawHeadingRef.current = filterAngle(newHeading, rawHeadingRef.current, 0.15);
    
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(() => {
        setHeading(Math.round(((rawHeadingRef.current % 360) + 360) % 360));
        animFrameId.current = null;
      });
    }
  }, []);

  const handleDeviceOrientation = useCallback((event) => {
    let newHeading;

    // iOS Safari webkitCompassHeading
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      newHeading = event.webkitCompassHeading;
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // W3C tilt-compensated compass heading formula fallback
      const alpha = event.alpha;
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      const _x = (beta * Math.PI) / 180;
      const _y = (gamma * Math.PI) / 180;
      const _z = (alpha * Math.PI) / 180;

      const cX = Math.cos(_x), cY = Math.cos(_y), cZ = Math.cos(_z);
      const sX = Math.sin(_x), sY = Math.sin(_y), sZ = Math.sin(_z);

      const Vx = -cZ * sY - sZ * sX * cY;
      const Vy = -sZ * sY + cZ * sX * cY;

      if (Vx === 0 && Vy === 0) {
        newHeading = 360 - alpha;
      } else {
        let compassH = Math.atan2(Vx, Vy);
        if (compassH < 0) compassH += 2 * Math.PI;
        newHeading = (compassH * 180) / Math.PI;
      }
    }

    if (newHeading !== undefined) {
      setFilteredHeading(newHeading);
    }
  }, [setFilteredHeading]);

  const startCompass = useCallback(() => {
    if (typeof window === 'undefined') return;

    setStatus('granted');

    // 1. Try W3C Generic Sensor API (AbsoluteOrientationSensor)
    if ('AbsoluteOrientationSensor' in window) {
      try {
        const sensor = new window.AbsoluteOrientationSensor({ frequency: 60 });
        sensor.addEventListener('reading', () => {
          const q = sensor.quaternion; // [x, y, z, w]
          // Calculate yaw (heading) in radians
          const yaw = Math.atan2(
            2 * q[0] * q[1] + 2 * q[2] * q[3],
            1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]
          );
          
          let headingDeg = yaw * (180 / Math.PI);
          if (headingDeg < 0) headingDeg += 360;
          
          setFilteredHeading(headingDeg);
        });
        
        sensor.addEventListener('error', (error) => {
          console.warn('AbsoluteOrientationSensor error:', error);
          if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
            setStatus('denied');
          } else {
            // Fallback to deviceorientation
            window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          }
        });
        
        sensor.start();
        return; // Success with AbsoluteOrientationSensor
      } catch (error) {
        console.warn('Failed to initialize AbsoluteOrientationSensor:', error);
      }
    }

    // 2. Fallback to DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    } else {
      setStatus('unsupported');
    }
  }, [handleDeviceOrientation, setFilteredHeading]);

  const requestPermission = useCallback(async () => {
    setStatus('requesting');
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await window.DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setNeedsPermission(false);
          startCompass();
        } else {
          setStatus('denied');
        }
      } catch (error) {
        console.error('Permission error:', error);
        setStatus('denied');
      }
    } else {
      // Non-iOS / non-permission required devices
      setNeedsPermission(false);
      startCompass();
    }
  }, [startCompass]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      }
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [handleDeviceOrientation]);

  return { heading, status, needsPermission, requestPermission };
};
