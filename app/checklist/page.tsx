'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { useStore, getChecklistProgress } from '@/lib/store';
import { CHECKLIST_CATEGORIES } from '@/lib/data';

export default function ChecklistPage() {
  const router = useRouter();
  const { checklist, toggleChecklist, resetChecklist } = useStore();
  const { completed, total } = getChecklistProgress();

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
        <h1 className="font-semibold text-lg text-text-primary">Don&apos;t Forget</h1>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          {completed} of {total} completed
        </p>
        <button
          type="button"
          onClick={() => resetChecklist()}
          className="text-xs font-medium text-accent active:opacity-70"
        >
          Reset All
        </button>
      </div>
      <div className="px-4 space-y-6">
        {CHECKLIST_CATEGORIES.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
              {cat.category}
            </h2>
            <div className="space-y-1.5">
              {cat.items.map((text) => {
                const i = index++;
                return (
                  <ChecklistItem
                    key={i}
                    text={text}
                    checked={checklist[i] ?? false}
                    onToggle={() => toggleChecklist(i)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
