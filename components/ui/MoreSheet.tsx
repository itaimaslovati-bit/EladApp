'use client';

import Link from 'next/link';
import { UtensilsCrossed, AlertCircle, MessageCircle, Luggage, Lightbulb, CheckSquare, ClipboardList, Camera, Map } from 'lucide-react';

const MORE_ITEMS = [
  { href: '/overview', label: 'Overview', emoji: '🗾', Icon: Map },
  { href: '/memories', label: 'Memories', emoji: '📸', Icon: Camera },
  { href: '/food', label: 'Food Guide', emoji: '🍜', Icon: UtensilsCrossed },
  { href: '/emergency', label: 'Emergency', emoji: '🚨', Icon: AlertCircle },
  { href: '/phrases', label: 'Phrases', emoji: '💬', Icon: MessageCircle },
  { href: '/packing', label: 'Packing', emoji: '🧳', Icon: Luggage },
  { href: '/ideas', label: 'Ideas', emoji: '💡', Icon: Lightbulb },
  { href: '/checklist', label: "Don't Forget", emoji: '✅', Icon: CheckSquare },
  { href: '/to-book', label: 'To Book', emoji: '📋', Icon: ClipboardList },
] as const;

export function MoreSheet() {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-[640px] mx-auto">
      {MORE_ITEMS.map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-divider bg-background text-text-secondary font-medium text-xs transition-colors active:scale-[0.97] active:bg-stone-100"
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-center">{label}</span>
        </Link>
      ))}
    </div>
  );
}
