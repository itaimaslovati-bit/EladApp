'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface TipBubbleProps {
  tip: string;
  className?: string;
}

export function TipBubble({ tip, className = '' }: TipBubbleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 border border-amber-400 text-amber-800 ml-1 shrink-0 active:scale-110 transition-transform"
        aria-label="Show tip"
      >
        <Lightbulb size={12} strokeWidth={2} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 sm:left-auto sm:right-0 bottom-full mb-2 z-[100] min-w-[200px] max-w-[min(400px,90vw)] p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-900 text-sm leading-relaxed shadow-lg"
          >
            <p className="pr-6">{tip}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-amber-700 hover:text-amber-900 text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
