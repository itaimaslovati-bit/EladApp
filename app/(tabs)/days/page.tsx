'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { MapPinLink } from '@/components/ui/MapPinLink';
import { TipBubble } from '@/components/ui/TipBubble';
import { PageTransition } from '@/components/ui/PageTransition';
import { CalendarView } from '@/components/ui/CalendarView';
import { MediaUploader } from '@/components/ui/MediaUploader';
import { TRIP_DAYS } from '@/lib/data';
import { REGION_COLORS } from '@/lib/regions';
import { getMediaCounts } from '@/lib/mediaStorage';
import { subscribeToMediaCounts } from '@/lib/cloudMediaStorage';
import { getTodayDayNumber } from '@/lib/utils';
import { useStore } from '@/lib/store';
import type { TripDay } from '@/lib/types';

function DayDetailContent({
  day,
  mediaCount,
  onMediaAdded,
}: {
  day: TripDay;
  mediaCount: number;
  onMediaAdded: () => void;
}) {
  return (
    <div className="space-y-4">
      {day.sections.map((sec) => (
        <div key={sec.title} className="detail-section">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5">
            {sec.title}
          </div>
          <ul className="space-y-1.5">
            {sec.items.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-1.5 text-[15px] leading-snug ${
                  item.isHighlight ? 'font-medium text-accent' : 'text-text-primary'
                }`}
              >
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
      <div className="mt-4 pt-4 border-t border-divider">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            📸 Memories {mediaCount > 0 ? `(${mediaCount})` : ''}
          </h4>
        </div>
        <MediaUploader dayNumber={day.dayNumber} onMediaAdded={onMediaAdded} />
      </div>
    </div>
  );
}

function DaysContent() {
  const searchParams = useSearchParams();
  const openDay = searchParams?.get('day') ? Number(searchParams.get('day')) : null;
  const {
    daysViewMode,
    setDaysViewMode,
    selectedCalendarDay,
    setSelectedCalendarDay,
    debugDayOverride,
  } = useStore();

  const todayDayNumber = debugDayOverride ?? getTodayDayNumber();

  const [cloudCounts, setCloudCounts] = useState<Record<number, number>>({});
  const [localCounts, setLocalCounts] = useState<Record<number, number>>({});
  const refreshMediaCounts = useCallback(() => {
    getMediaCounts().then(setLocalCounts); // local = videos only (images are in cloud)
  }, []);

  useEffect(() => {
    return subscribeToMediaCounts(setCloudCounts);
  }, []);
  useEffect(() => {
    refreshMediaCounts();
  }, [refreshMediaCounts]);

  const mediaCountByDay = useMemo(() => {
    const out: Record<number, number> = {};
    const days = new Set([...Object.keys(cloudCounts).map(Number), ...Object.keys(localCounts).map(Number)]);
    days.forEach((d) => {
      out[d] = (cloudCounts[d] ?? 0) + (localCounts[d] ?? 0);
    });
    return out;
  }, [cloudCounts, localCounts]);

  const dayMap = useMemo(() => {
    const m = new Map<number, TripDay>();
    TRIP_DAYS.forEach((d) => {
      m.set(d.dayNumber, d);
      if (d.dayLabel.includes('-')) {
        const [start, end] = d.dayLabel.split('-').map(Number);
        if (!Number.isNaN(end)) for (let i = start; i <= end; i++) m.set(i, d);
      }
    });
    return m;
  }, []);

  useEffect(() => {
    if (todayDayNumber == null) return;
    if (daysViewMode === 'calendar') {
      setSelectedCalendarDay(todayDayNumber);
    }
  }, [daysViewMode, todayDayNumber, setSelectedCalendarDay]);

  useEffect(() => {
    if (daysViewMode !== 'list' || todayDayNumber == null) return;
    const dayForToday = dayMap.get(todayDayNumber);
    if (!dayForToday) return;
    const t = setTimeout(() => {
      document.getElementById(`day-card-${dayForToday.dayNumber}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);
    return () => clearTimeout(t);
  }, [daysViewMode, todayDayNumber, dayMap]);

  const orderedDays = useMemo(() => {
    const seen = new Set<number>();
    return TRIP_DAYS.filter((d) => {
      const n = d.dayNumber;
      if (seen.has(n)) return false;
      seen.add(n);
      return true;
    });
  }, []);

  return (
    <PageTransition className="pb-6 overflow-touch">
      <LargeTitle title="Day by Day" subtitle="39 days · Tap to expand" />

      {/* Segmented control: Calendar | List */}
      <div className="px-4 mt-2 mb-4">
        <div
          className="inline-flex rounded-full p-1 bg-gray-100"
          role="tablist"
          aria-label="View mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={daysViewMode === 'calendar'}
            onClick={() => setDaysViewMode('calendar')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              daysViewMode === 'calendar'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            Calendar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={daysViewMode === 'list'}
            onClick={() => setDaysViewMode('list')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              daysViewMode === 'list'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {daysViewMode === 'calendar' ? (
        <CalendarView
          days={TRIP_DAYS}
          selectedDay={selectedCalendarDay}
          onSelectDay={setSelectedCalendarDay}
          mediaCountByDay={mediaCountByDay}
          onMediaAdded={refreshMediaCounts}
          todayDayNumber={todayDayNumber}
        />
      ) : (
        <div className="px-4 space-y-3">
          {orderedDays.map((day) => {
            const isToday = todayDayNumber != null && dayMap.get(todayDayNumber) === day;
            return (
              <div
                key={day.dayNumber}
                id={`day-card-${day.dayNumber}`}
                className={`rounded-2xl overflow-hidden transition-shadow ${
                  isToday
                    ? 'border-2 border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-200 shadow-md shadow-emerald-100'
                    : ''
                }`}
              >
                <CollapsibleCard
                  defaultOpen={
                    (openDay != null && dayMap.get(openDay) === day) ||
                    (todayDayNumber != null && dayMap.get(todayDayNumber) === day)
                  }
                  header={
                    <>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: REGION_COLORS[day.region] }}
                      >
                        {day.dayLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[15px] text-text-primary truncate">
                            {day.title}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0">
                              Today
                            </span>
                          )}
                          {day.mapsLink && <MapPinLink href={day.mapsLink} size={12} />}
                        </div>
                        <div className="text-xs text-text-secondary">{day.date}</div>
                      </div>
                    </>
                  }
                >
                  <DayDetailContent
                    day={day}
                    mediaCount={mediaCountByDay[day.dayNumber] ?? 0}
                    onMediaAdded={refreshMediaCounts}
                  />
                </CollapsibleCard>
              </div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}

export default function DaysPage() {
  return (
    <Suspense
      fallback={
        <PageTransition className="pb-6">
          <LargeTitle title="Day by Day" subtitle="Loading…" />
        </PageTransition>
      }
    >
      <DaysContent />
    </Suspense>
  );
}
