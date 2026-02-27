'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  text: string;
  checked: boolean;
  onToggle: () => void;
}

export function ChecklistItem({ text, checked, onToggle }: ChecklistItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface border border-divider text-left transition-opacity active:scale-[0.99] min-h-[44px]"
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
          checked ? 'bg-rural border-rural text-white' : 'border-divider'
        }`}
        initial={false}
        animate={{
          scale: checked ? 1 : 1,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        }}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </motion.div>
      <span
        className={`text-[15px] font-medium flex-1 ${
          checked ? 'line-through opacity-60 text-text-secondary' : 'text-text-primary'
        }`}
      >
        {text}
      </span>
    </motion.button>
  );
}
