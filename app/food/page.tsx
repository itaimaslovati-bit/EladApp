'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { FOOD_REGIONS } from '@/lib/data';

export default function FoodPage() {
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
        <h1 className="font-semibold text-lg text-text-primary">Food Guide</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        {FOOD_REGIONS.map((region) => (
          <div key={region.title} className="rounded-xl border border-divider bg-surface p-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">{region.title}</h2>
            <div className="space-y-3">
              {region.items.map((item) => (
                <div key={item.name} className="flex gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                  <span className="text-xl w-7 shrink-0 text-center">{item.emoji}</span>
                  <div>
                    <span className="font-semibold text-text-primary">{item.name}</span>
                    <p className="text-sm text-text-secondary mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
