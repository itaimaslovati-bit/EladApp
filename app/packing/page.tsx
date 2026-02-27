'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { useStore, getPackingProgress } from '@/lib/store';
import { PACKING_SECTIONS } from '@/lib/data';

export default function PackingPage() {
  const router = useRouter();
  const { packingChecked = {}, togglePacking, resetPacking } = useStore();
  const { completed, total } = getPackingProgress();

  let index = 0;
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
        <h1 className="font-semibold text-lg text-text-primary">Packing</h1>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          {completed} of {total} completed
        </p>
        <button
          type="button"
          onClick={() => resetPacking()}
          className="text-xs font-medium text-accent active:opacity-70"
        >
          Reset All
        </button>
      </div>
      <div className="px-4 pt-4 space-y-6">
        {PACKING_SECTIONS.map((sec) => (
          <section key={sec.title}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
              {sec.title}
            </h2>
            <div className="space-y-1.5">
              {sec.items.map((item) => {
                const i = index++;
                return (
                  <ChecklistItem
                    key={item.text}
                    text={item.text}
                    checked={packingChecked[i] ?? false}
                    onToggle={() => togglePacking(i)}
                  />
                );
              })}
            </div>
            {sec.note && (
              <p className="text-xs text-text-secondary italic mt-3 pt-2 border-t border-stone-100">
                {sec.note}
              </p>
            )}
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
