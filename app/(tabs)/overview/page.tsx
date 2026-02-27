'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { RegionBadge } from '@/components/ui/RegionBadge';
import { MapPinLink } from '@/components/ui/MapPinLink';
import { PageTransition } from '@/components/ui/PageTransition';
import { OVERVIEW_DAYS } from '@/lib/data';
import { REGION_LABELS } from '@/lib/regions';
import { REGION_COLORS } from '@/lib/regions';
import { getTodayDayNumber } from '@/lib/utils';
import { useStore } from '@/lib/store';
import type { Region } from '@/lib/types';

const REGIONS: Region[] = ['tokyo', 'kyoto', 'osaka', 'rural', 'kyushu', 'okinawa', 'aso'];

export default function OverviewPage() {
  const [filter, setFilter] = useState<Region[]>([]);
  const { debugDayOverride } = useStore();
  const todayDayNumber = debugDayOverride ?? getTodayDayNumber();

  const grouped = useMemo(() => {
    const map = new Map<Region, typeof OVERVIEW_DAYS>();
    REGIONS.forEach((r) => map.set(r, []));
    OVERVIEW_DAYS.forEach((d) => {
      if (filter.length === 0 || filter.includes(d.region)) {
        map.get(d.region)!.push(d);
      }
    });
    return REGIONS.map((r) => ({ region: r, days: map.get(r)! })).filter((g) => g.days.length > 0);
  }, [filter]);

  const toggleRegion = (r: Region) => {
    setFilter((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  return (
    <PageTransition className="pb-6 overflow-touch">
      <LargeTitle
        title="Japan Trip"
        subtitle="Tal & Elad · 39 Days · 7 Regions"
      >
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="text-xs font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-full border border-divider">
            39 Days
          </span>
          <span className="text-xs font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-full border border-divider">
            7 Regions
          </span>
          <span className="text-xs font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-full border border-divider">
            Tokyo → Okinawa → Tokyo
          </span>
        </div>
      </LargeTitle>

      <div className="px-4 pb-4 border-b border-divider">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Filter by region
        </p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRegion(r)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                borderColor: filter.includes(r) ? REGION_COLORS[r] : '#E7E5E4',
                backgroundColor: filter.includes(r) ? REGION_COLORS[r] : 'white',
                color: filter.includes(r) ? 'white' : '#78716C',
              }}
            >
              {REGION_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {grouped.map(({ region, days }) => (
          <div key={region} className="region-group">
            <div className="flex items-center gap-2 mb-2">
              <RegionBadge region={region} label={REGION_LABELS[region]} />
            </div>
            <div className="space-y-1.5">
              {days.map((day) => {
                const isToday = day.dayNumber === todayDayNumber;
                return (
                  <Link
                    key={day.dayNumber}
                    href={`/days/${day.dayNumber}`}
                    className={`flex items-stretch rounded-xl border overflow-hidden min-h-[48px] active:scale-[0.99] transition-transform ${
                      isToday
                        ? 'border-emerald-400 bg-emerald-50/80 ring-1 ring-emerald-200'
                        : 'border-divider bg-surface'
                    }`}
                  >
                    <div
                      className="w-1 shrink-0"
                      style={{ backgroundColor: REGION_COLORS[day.region] }}
                    />
                    <div className="w-9 flex items-center justify-center shrink-0 text-text-secondary font-bold text-sm">
                      {day.dayNumber}
                    </div>
                    <div className="flex-1 py-2.5 px-2 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-text-primary truncate">
                          {day.title}
                        </span>
                        {day.mapsLink && (
                          <MapPinLink href={day.mapsLink} size={12} />
                        )}
                      </div>
                      <div className="text-xs text-text-secondary">{day.date}</div>
                    </div>
                    {isToday && (
                      <div className="flex items-center px-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    {day.hotel && (
                      <div className="flex items-center px-2 py-2 text-xs text-text-secondary shrink-0 text-right">
                        <span className="mr-1">{day.hotel.emoji}</span>
                        <span className="truncate max-w-[100px]">{day.hotel.name}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
