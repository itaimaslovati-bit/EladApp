'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PHRASE_CATEGORIES } from '@/lib/data';

export default function PhrasesPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const copyJapanese = (jp: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jp);
      setToast('Copied!');
      setTimeout(() => setToast(null), 1500);
    }
  };

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
        <h1 className="font-semibold text-lg text-text-primary">Phrases</h1>
      </div>
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-4 py-2 rounded-full z-50 shadow-lg">
          {toast}
        </div>
      )}
      <div className="px-4 pt-6 space-y-4">
        {PHRASE_CATEGORIES.map((cat) => (
          <div key={cat.title} className="rounded-xl border border-divider bg-surface p-4">
            <h2 className="text-base font-bold text-text-primary mb-3">{cat.title}</h2>
            <div className="space-y-2">
              {cat.phrases.map((p) => (
                <div
                  key={p.en}
                  className="grid grid-cols-2 gap-2 py-2 border-b border-stone-100 last:border-0 items-center"
                >
                  <span className="text-sm text-text-secondary">{p.en}</span>
                  <button
                    type="button"
                    onClick={() => copyJapanese(p.jp)}
                    className="text-sm font-semibold text-right font-[inherit] hover:bg-stone-100 rounded px-2 py-1 -mr-2 transition-colors"
                  >
                    {p.jp}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
