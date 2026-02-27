'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { MapPinLink } from '@/components/ui/MapPinLink';
import { TipBubble } from '@/components/ui/TipBubble';
import { PageTransition } from '@/components/ui/PageTransition';
import { TRIP_DAYS } from '@/lib/data';
import { REGION_COLORS } from '@/lib/regions';
import type { TripDay } from '@/lib/types';

function findDayByNumber(n: number): TripDay | undefined {
  const num = Number(n);
  for (const d of TRIP_DAYS) {
    if (d.dayNumber === num) return d;
    if (d.dayLabel.includes('-')) {
      const [start, end] = d.dayLabel.split('-').map(Number);
      if (!isNaN(end) && num >= start && num <= end) return d;
    }
  }
  return undefined;
}

function DayDetailContent({ day }: { day: TripDay }) {
  return (
    <div className="space-y-4">
      {day.sections.map((sec) => (
        <div key={sec.title}>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5">
            {sec.title}
          </div>
          <ul className="space-y-1.5">
            {sec.items.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[15px] leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary shrink-0 mt-2" />
                <span className="flex-1 min-w-0">
                  {item.text}
                  {item.tip && <TipBubble tip={item.tip} className="inline-flex ml-0.5" />}
                </span>
                {item.mapsLink && (
                  <MapPinLink href={item.mapsLink} size={14} className="shrink-0 mt-0.5" />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = params?.dayNumber ? Number(params.dayNumber) : null;
  const day = dayNumber != null ? findDayByNumber(dayNumber) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (day && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [day]);

  if (dayNumber == null || !day) {
    return (
      <PageTransition className="p-4">
        <Link href="/days" className="inline-flex items-center gap-1 text-accent font-medium">
          <ChevronLeft size={20} /> Back to Days
        </Link>
        <p className="mt-4 text-text-secondary">Day not found.</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pb-6 overflow-touch">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-divider px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-text-primary active:opacity-70"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-text-primary">Day {day.dayLabel}</span>
      </div>
      <div ref={scrollRef} className="px-4 pt-4">
        <CollapsibleCard
          defaultOpen
          header={
            <>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: REGION_COLORS[day.region] }}
              >
                {day.dayLabel}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[15px] text-text-primary truncate">
                    {day.title}
                  </span>
                  {day.mapsLink && <MapPinLink href={day.mapsLink} size={12} />}
                </div>
                <div className="text-xs text-text-secondary">{day.date}</div>
              </div>
            </>
          }
        >
          <DayDetailContent day={day} />
        </CollapsibleCard>
      </div>
    </PageTransition>
  );
}
