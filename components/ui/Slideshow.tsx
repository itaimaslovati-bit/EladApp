'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';

export interface SlideshowPhoto {
  id: string;
  dayNumber: number;
  imageData: string;
  dayTitle: string;
  dayDate: string;
}

interface SlideshowProps {
  onClose: () => void;
  /** Cloud + local images for slideshow (imageData / dataUrl) */
  photos: SlideshowPhoto[];
}

export function Slideshow({ onClose, photos: photosProp }: SlideshowProps) {
  const photos = photosProp;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = photos.length;
  const current = photos[currentIndex];

  const goNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
    setShowPlayPauseIcon(true);
    setTimeout(() => setShowPlayPauseIcon(false), 800);
  }, []);

  useEffect(() => {
    if (!isPlaying || total === 0) return;
    intervalRef.current = setInterval(goNext, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, total, goNext]);

  if (total === 0) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center p-6">
        <p className="text-white/80 text-center">No photos yet. Add some memories first!</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 px-6 py-3 rounded-xl bg-white/20 text-white font-medium"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Progress bar at top */}
      <div className="h-1 bg-white/20 shrink-0">
        <motion.div
          className="h-full bg-white"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Close button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Tap zones: left = prev, center = play/pause, right = next */}
      <div className="flex-1 flex relative">
        <button
          type="button"
          onClick={() => {
            goPrev();
            setIsPlaying(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => setIsPlaying(true), 5000);
          }}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Previous"
        />
        <button
          type="button"
          onClick={togglePlayPause}
          className="absolute left-1/3 top-0 bottom-0 w-1/3 z-10 flex items-center justify-center"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <AnimatePresence>
            {showPlayPauseIcon && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/90"
              >
                {isPlaying ? <Pause size={48} /> : <Play size={48} fill="white" />}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          type="button"
          onClick={() => {
            goNext();
            setIsPlaying(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => setIsPlaying(true), 5000);
          }}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Next"
        />
      </div>

      {/* Current image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-full max-h-full flex items-center justify-center px-4"
            >
              <img
                src={current.imageData}
                alt=""
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain will-change-opacity"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preload next 2 */}
      {photos.slice(currentIndex + 1, currentIndex + 3).map((p) => (
        <img key={p.id} src={p.imageData} alt="" className="hidden" />
      ))}

      {/* Bottom overlay: day title + date */}
      {current && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-white text-center pointer-events-none"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          <div className="font-semibold">Day {current.dayNumber} · {current.dayTitle}</div>
          <div className="text-sm text-white/90">{current.dayDate}</div>
        </div>
      )}
    </div>
  );
}
