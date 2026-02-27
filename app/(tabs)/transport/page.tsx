'use client';

import { LargeTitle } from '@/components/ui/LargeTitle';
import { PageTransition } from '@/components/ui/PageTransition';
import { TRANSPORT_REGIONS } from '@/lib/data';

function formatDetails(str: string): string[] {
  return str
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=\.)\s+/)
    .filter(Boolean);
}

export default function TransportPage() {
  return (
    <PageTransition className="pb-6 overflow-touch">
      <LargeTitle title="Transport" subtitle="Getting around Japan" />
      <div className="px-4 space-y-6">
        {TRANSPORT_REGIONS.map((region) => (
          <section key={region.title}>
            <h2 className="text-base font-bold border-b-2 border-divider pb-1.5 mb-3 flex items-center gap-2">
              {region.title}
            </h2>
            <div className="space-y-3">
              {region.legs.map((leg) => (
                <div
                  key={leg.dayLabel + leg.route}
                  className="rounded-xl border border-divider bg-surface p-4"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {leg.dayLabel}
                    </span>
                    <span className="font-semibold text-sm text-text-primary">{leg.route}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                    {leg.method}
                  </div>
                  <div className="text-sm text-text-secondary leading-relaxed space-y-1">
                    {formatDetails(leg.details).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {leg.tip && (
                    <div className="mt-2 pl-3 border-l-2 border-amber-400 bg-amber-50 text-amber-900 text-xs rounded-r-md py-1.5">
                      {leg.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
