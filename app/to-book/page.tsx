'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { useStore, getToBookProgress } from '@/lib/store';
import { TODO_ITEMS } from '@/lib/data';

const urgencyStyles: Record<string, string> = {
  high: 'bg-red-50 text-red-700',
  med: 'bg-amber-50 text-amber-800',
  low: 'bg-blue-50 text-blue-700',
};

export default function ToBookPage() {
  const router = useRouter();
  const { toBookChecked, toggleToBook, resetToBook } = useStore();
  const { completed, total } = getToBookProgress();

  return (
    <PageTransition className="min-h-screen pb-8">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-divider px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-text-primary active:opacity-70"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg text-text-primary">To Book</h1>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          {completed} of {total} completed
        </p>
        <button
          type="button"
          onClick={() => resetToBook()}
          className="text-xs font-medium text-accent active:opacity-70"
        >
          Reset All
        </button>
      </div>
      <p className="px-4 text-sm text-text-secondary border-b border-divider pb-4">
        Things from your plan that still need booking, plus items worth reserving in advance for March/April in Japan.
      </p>
      <div className="px-4 pt-6 space-y-4">
        <h2 className="text-sm font-bold text-text-primary">⚠️ From Your Plan — Not Yet Booked</h2>
        <div className="space-y-1.5">
          {TODO_ITEMS.slice(0, 6).map((item, i) => (
            <ChecklistItem
              key={item.title}
              text={item.title}
              detail={item.detail}
              badge={item.when}
              badgeClassName={urgencyStyles[item.urgency]}
              checked={toBookChecked[i] ?? false}
              onToggle={() => toggleToBook(i)}
            />
          ))}
        </div>
        <h2 className="text-sm font-bold text-text-primary pt-4">💡 Recommend Booking in Advance</h2>
        <div className="space-y-1.5">
          {TODO_ITEMS.slice(6).map((item, i) => (
            <ChecklistItem
              key={item.title}
              text={item.title}
              detail={item.detail}
              badge={item.when}
              badgeClassName={urgencyStyles[item.urgency]}
              checked={toBookChecked[6 + i] ?? false}
              onToggle={() => toggleToBook(6 + i)}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
