'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const MIN_DISPLAY_MS = 2500;
const MAX_WAIT_MS = 20000;
const FADEOUT_MS = 500;
const VIDEO_LOAD_TIMEOUT_MS = 3500; // if video doesn't load/play by then, show fallback and allow continue
const FALLBACK_AUTO_CONTINUE_MS = 4000; // when video failed, auto-continue after this

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'video' | 'text' | 'subtitle' | 'fadeout' | 'done'>('video');
  const [videoError, setVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showTapToStart, setShowTapToStart] = useState(false);
  const [showContinue, setShowContinue] = useState(false); // when video fails, show "Continue"
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase('done');
    onComplete();
  }, [onComplete]);

  // Set video src after mount — use full URL so it works in preview/deploy (same origin)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVideoSrc(`${window.location.origin}/splash.mp4`);
  }, []);

  // Force video to play — multiple strategies for mobile (iOS Safari is strict)
  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => setVideoError(true));
    };

    const onCanPlay = () => {
      tryPlay();
    };
    video.addEventListener('loadeddata', onCanPlay, { once: true });
    video.addEventListener('canplay', onCanPlay, { once: true });
    video.addEventListener('canplaythrough', onCanPlay, { once: true });
    const t = setTimeout(tryPlay, 400);
    const tapPrompt = setTimeout(() => {
      if (videoRef.current?.paused && !completedRef.current) {
        setShowTapToStart(true);
      }
    }, 1000);
    return () => {
      clearTimeout(t);
      clearTimeout(tapPrompt);
      video.removeEventListener('loadeddata', onCanPlay);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
    };
  }, [videoSrc]);

  // If video fails to load or play within timeout, show fallback and auto-continue
  useEffect(() => {
    let innerT: ReturnType<typeof setTimeout>;
    const timeout = setTimeout(() => {
      if (completedRef.current) return;
      const v = videoRef.current;
      const notPlaying = !v || v.error || (v.readyState < 2) || (v.paused && !v.ended);
      if (notPlaying) {
        setVideoError(true);
        setPhase('subtitle');
        setShowTapToStart(false);
        setShowContinue(true);
        innerT = setTimeout(handleComplete, FALLBACK_AUTO_CONTINUE_MS);
      }
    }, VIDEO_LOAD_TIMEOUT_MS);
    return () => {
      clearTimeout(timeout);
      if (innerT != null) clearTimeout(innerT);
    };
  }, [videoSrc, handleComplete]);

  const onVideoError = useCallback(() => {
    setVideoError(true);
    setPhase('subtitle');
    setShowTapToStart(false);
    setShowContinue(true);
    setTimeout(handleComplete, FALLBACK_AUTO_CONTINUE_MS);
  }, [handleComplete]);

  const onTapToStart = useCallback(() => {
    setShowTapToStart(false);
    videoRef.current?.play().catch(() => setVideoError(true));
  }, []);

  // Show text immediately (no clip-path), subtitle after 1.5s — so we never show a black screen
  useEffect(() => {
    const t1 = setTimeout(() => setPhase((p) => (p === 'video' ? 'text' : p)), 0);
    const t2 = setTimeout(() => setPhase((p) => (p !== 'done' ? 'subtitle' : p)), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // When video ends: wait for min display time, then fade out and complete
  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const startTime = Date.now();
    const onEnded = () => {
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        setPhase('fadeout');
        setTimeout(handleComplete, FADEOUT_MS);
      }, wait);
    };

    video.addEventListener('ended', onEnded, { once: true });
    return () => video.removeEventListener('ended', onEnded);
  }, [videoSrc, handleComplete]);

  // Fallback: close after MAX_WAIT_MS if video never ends
  useEffect(() => {
    const t = setTimeout(() => {
      if (completedRef.current) return;
      setPhase('fadeout');
      setTimeout(handleComplete, FADEOUT_MS);
    }, MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [handleComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video background — src set after mount for mobile; programmatic play(); full video then fade */}
      {videoSrc && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop={false}
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
          src={videoSrc}
          onError={onVideoError}
          onPlay={() => setShowTapToStart(false)}
        />
      )}

      {/* Mobile: tap to start video when autoplay is blocked */}
      {showTapToStart && (
        <button
          type="button"
          onClick={onTapToStart}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
          aria-label="Play video"
        >
          <span className="rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-gray-900 shadow-lg">
            Tap to start
          </span>
        </button>
      )}

      {/* Dark overlay — below text so greeting is always visible; lighter so not pitch black */}
      <motion.div
        className="absolute inset-0 z-[1] bg-black"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: videoError ? 0.5 : 0.4 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Content — above overlay; text always visible (no clip-path) so never black */}
      <div className="relative z-20 flex flex-col items-center justify-center px-8">
        {/* こんにちは — visible immediately with short fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
            fontWeight: 100,
            fontSize: 'clamp(48px, 12vw, 80px)',
            color: 'white',
            letterSpacing: '0.15em',
            textAlign: 'center',
            textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          こんにちは
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: phase === 'subtitle' || phase === 'fadeout' ? 0.9 : 0,
            y: phase === 'subtitle' || phase === 'fadeout' ? 0 : 8,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.08em',
            marginTop: '12px',
          }}
        >
          Tal & Elad · Japan 2026
        </motion.div>

        {/* When video failed: show Continue button (auto-continue also runs) */}
        {showContinue && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleComplete}
            className="mt-8 rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-gray-900 shadow-lg"
          >
            Continue
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
