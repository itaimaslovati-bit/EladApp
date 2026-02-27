'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { EMERGENCY_CARDS } from '@/lib/data';

export default function EmergencyPage() {
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
        <h1 className="font-semibold text-lg text-text-primary">Emergency</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        {EMERGENCY_CARDS.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border p-4 ${
              card.urgent
                ? 'border-red-300 bg-red-50'
                : 'border-divider bg-surface'
            }`}
          >
            <h2 className="text-base font-bold text-text-primary mb-3">{card.title}</h2>
            <dl className="space-y-2">
              {card.items.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-1 border-b border-stone-100 last:border-0"
                >
                  <dt className="text-sm text-text-secondary">{item.label}</dt>
                  <dd className="text-sm font-semibold text-right">
                    {item.label === 'Police' || item.label === 'Fire / Ambulance' ? (
                      <a href={`tel:${item.value.replace(/\s/g, '')}`} className="text-red-600 text-base">
                        {item.value}
                      </a>
                    ) : (
                      <span className={item.big ? 'text-red-600 text-lg' : ''}>{item.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
