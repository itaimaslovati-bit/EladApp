'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  text: string;
  checked: boolean;
  onToggle: () => void;
  /** Optional second line (e.g. for To Book detail) */
  detail?: string;
  /** Optional badge text (e.g. "Book soon") */
  badge?: string;
  /** Extra class for the badge pill */
  badgeClassName?: string;
}

export function ChecklistItem({ text, checked, onToggle, detail, badge, badgeClassName }: ChecklistItemProps) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="w-full flex items-start gap-3 p-4 rounded-xl bg-surface border border-divider text-left transition-opacity active:scale-[0.99] min-h-[44px] cursor-pointer select-none"
      style={{ touchAction: 'manipulation' }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
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
      <div className="flex-1 min-w-0">
        <span
          className={`text-[15px] font-medium block ${
            checked ? 'line-through opacity-60 text-text-secondary' : 'text-text-primary'
          }`}
        >
          {text}
        </span>
        {detail != null && detail !== '' && (
          <p className={`text-sm mt-0.5 ${checked ? 'opacity-50 text-text-secondary' : 'text-text-secondary'}`}>
            {detail}
          </p>
        )}
        {badge != null && badge !== '' && (
          <span
            className={`inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded-full ${badgeClassName ?? 'bg-stone-100 text-text-secondary'}`}
          >
            {badge}
          </span>
        )}
      </div>
    </motion.button>
  );
}
