'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DisplayMediaItem } from '@/lib/mediaTypes';

interface LightboxProps {
  media: DisplayMediaItem;
  onClose: () => void;
  onDelete: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function Lightbox({
  media,
  onClose,
  onDelete,
  onPrev,
  onNext,
}: LightboxProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (media.type !== 'video') return;
    let url: string | null = null;
    fetch(media.fullUrl)
      .then((r) => r.blob())
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setVideoUrl(url);
      });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [media.id, media.type, media.fullUrl]);

  const handleDelete = () => {
    if (confirm('Delete this?')) {
      onDelete();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between p-3 shrink-0">
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-full text-red-400 hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Delete"
          >
            <Trash2 size={22} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative min-h-0">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-start pl-2"
              aria-label="Previous"
            >
              <ChevronLeft size={36} className="text-white/80" />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-end pr-2"
              aria-label="Next"
            >
              <ChevronRight size={36} className="text-white/80" />
            </button>
          )}

          <div className="max-w-full max-h-full flex items-center justify-center touch-pinch-zoom">
            {media.type === 'image' ? (
              <img
                src={media.fullUrl}
                alt=""
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                style={{ touchAction: 'pinch-zoom' }}
              />
            ) : (
              <div className="max-w-full max-h-[70vh] w-full">
                {videoUrl && (
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-auto max-h-[70vh]"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
