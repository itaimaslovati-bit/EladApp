'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { IRAN_POPUP } from '@/lib/data';

export function IranPopup() {
  const { iranDismissed, setIranDismissed } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const show = mounted && !iranDismissed;

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-2xl p-6 max-w-[340px] w-full text-center shadow-2xl"
        >
          <div className="text-4xl mb-2">{IRAN_POPUP.emoji}</div>
          <h2 className="text-lg font-bold text-text-primary">{IRAN_POPUP.title}</h2>
          <p className="text-sm text-text-secondary mt-1">{IRAN_POPUP.subtitle}</p>
          <p className="text-base font-bold text-text-primary my-4">{IRAN_POPUP.question}</p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={setIranDismissed}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 text-white active:scale-95 transition-transform"
            >
              {IRAN_POPUP.buttons[0]}
            </button>
            <button
              type="button"
              onClick={setIranDismissed}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-blue-600 text-white active:scale-95 transition-transform"
            >
              {IRAN_POPUP.buttons[1]}
            </button>
          </div>
          <p className="text-[10px] text-text-secondary mt-4">{IRAN_POPUP.footer}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
