'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PACKING_SECTIONS } from '@/lib/data';

export default function PackingPage() {
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
        <h1 className="font-semibold text-lg text-text-primary">Packing</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        {PACKING_SECTIONS.map((sec) => (
          <div key={sec.title} className="rounded-xl border border-divider bg-surface p-4">
            <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
              {sec.title}
            </h2>
            <ul className="space-y-2">
              {sec.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-sm">
                  <span className="w-4 h-4 rounded border border-stone-300 shrink-0 mt-0.5" />
                  <span className="text-text-primary">{item.text}</span>
                </li>
              ))}
            </ul>
            {sec.note && (
              <p className="text-xs text-text-secondary italic mt-3 pt-2 border-t border-stone-100">
                {sec.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
