'use client';

import { useRef } from 'react';
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
  const handledRef = useRef(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (handledRef.current) return;
    handledRef.current = true;
    onToggle();
    setTimeout(() => {
      handledRef.current = false;
    }, 300);
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (handledRef.current) return;
    onToggle();
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      className="w-full flex items-start gap-3 p-4 rounded-xl bg-surface border border-divider text-left transition-opacity active:scale-[0.99] min-h-[44px] min-w-[44px] cursor-pointer select-none touch-manipulation"
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          checked ? 'bg-rural border-rural text-white' : 'border-divider'
        }`}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </div>
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
    </button>
  );
}
