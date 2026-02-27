'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { IDEA_ITEMS } from '@/lib/data';

export default function IdeasPage() {
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
        <h1 className="font-semibold text-lg text-text-primary">Ideas</h1>
      </div>
      <p className="px-4 pt-4 text-sm text-text-secondary border-b border-divider pb-4">
        Based on your route, these are the top things you might be missing. Only the highlights.
      </p>
      <div className="px-4 pt-6 space-y-4">
        {IDEA_ITEMS.map((idea) => (
          <div
            key={idea.title}
            className="rounded-xl border border-divider bg-surface p-4"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: idea.regionColor }}
            >
              {idea.region}
            </span>
            <h2 className="text-base font-bold text-text-primary mt-1">{idea.title}</h2>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">{idea.description}</p>
            <span
              className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-md"
              style={{
                backgroundColor: `${idea.regionColor}20`,
                color: idea.regionColor,
              }}
            >
              {idea.fit}
            </span>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
