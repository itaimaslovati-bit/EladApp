'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_VIDEO_SRC = '/splash.mp4';
const DURATION_MS = 4300;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'video' | 'text' | 'subtitle' | 'fadeout' | 'done'>('video');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleComplete = useCallback(() => {
    setPhase('done');
    onComplete();
  }, [onComplete]);

  // Force video to play (required in production / some browsers even with autoPlay muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      video.muted = true;
      video.play().catch(() => setVideoError(true));
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play, { once: true });
    return () => video.removeEventListener('loadeddata', play);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 500);
    const t2 = setTimeout(() => setPhase('subtitle'), 2500);
    const t3 = setTimeout(() => setPhase('fadeout'), 3800);
    const t4 = setTimeout(handleComplete, DURATION_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [handleComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video background — ref + programmatic play() for production */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
        src={SPLASH_VIDEO_SRC}
        onError={() => setVideoError(true)}
      />

      {/* Dark overlay — fades from full black to 50% so video shows through */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: videoError ? 0.5 : 0.45 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8">
        {/* こんにちは — clip-path reveal (Option A) */}
        <div
          className={`splash-hello-text ${phase !== 'video' ? 'splash-hello-reveal' : ''}`}
          style={{
            fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
            fontWeight: 100,
            fontSize: 'clamp(48px, 12vw, 80px)',
            color: 'white',
            letterSpacing: '0.15em',
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          こんにちは
        </div>

        {/* Subtitle */}
        <motion.div
          className="splash-subtitle"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: phase === 'subtitle' || phase === 'fadeout' ? 0.75 : 0,
            y: phase === 'subtitle' || phase === 'fadeout' ? 0 : 8,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.08em',
            marginTop: '12px',
          }}
        >
          Tal & Elad · Japan 2025
        </motion.div>
      </div>
    </motion.div>
  );
}
