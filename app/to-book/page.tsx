'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { TODO_ITEMS } from '@/lib/data';

const urgencyStyles = {
  high: 'bg-red-50 text-red-700',
  med: 'bg-amber-50 text-amber-800',
  low: 'bg-blue-50 text-blue-700',
};

export default function ToBookPage() {
  const router = useRouter();
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
      <p className="px-4 pt-4 text-sm text-text-secondary border-b border-divider pb-4">
        Things from your plan that still need booking, plus items worth reserving in advance for March/April in Japan.
      </p>
      <div className="px-4 pt-6 space-y-4">
        <h2 className="text-sm font-bold text-text-primary">⚠️ From Your Plan — Not Yet Booked</h2>
        {TODO_ITEMS.slice(0, 6).map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-divider bg-surface p-4"
          >
            <h3 className="font-semibold text-[15px] text-text-primary">{item.title}</h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">{item.detail}</p>
            <span
              className={`inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded-full ${urgencyStyles[item.urgency]}`}
            >
              {item.when}
            </span>
          </div>
        ))}
        <h2 className="text-sm font-bold text-text-primary pt-4">💡 Recommend Booking in Advance</h2>
        {TODO_ITEMS.slice(6).map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-divider bg-surface p-4"
          >
            <h3 className="font-semibold text-[15px] text-text-primary">{item.title}</h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">{item.detail}</p>
            <span
              className={`inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded-full ${urgencyStyles[item.urgency]}`}
            >
              {item.when}
            </span>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
