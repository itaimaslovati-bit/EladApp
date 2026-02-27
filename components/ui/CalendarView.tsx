'use client';

import { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  differenceInDays,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TRIP_DAYS } from '@/lib/data';
import { REGION_COLORS } from '@/lib/regions';
import { getMediaCounts } from '@/lib/mediaStorage';
import { MapPinLink } from '@/components/ui/MapPinLink';
import { TipBubble } from '@/components/ui/TipBubble';
import { MediaUploader } from '@/components/ui/MediaUploader';
import type { TripDay } from '@/lib/types';

const TRIP_START = new Date(2025, 2, 7); // Mar 7, 2025
const TRIP_END = new Date(2025, 3, 14);   // Apr 14, 2025

function dateToTripDayNumber(date: Date): number | null {
  const days = differenceInDays(date, TRIP_START);
  if (days >= 0 && days < 39) return days + 1;
  return null;
}

function getDayByNumber(dayNumber: number): TripDay | undefined {
  const num = dayNumber;
  for (const d of TRIP_DAYS) {
    if (d.dayNumber === num) return d;
    if (d.dayLabel.includes('-')) {
      const [start, end] = d.dayLabel.split('-').map(Number);
      if (!Number.isNaN(end) && num >= start && num <= end) return d;
    }
  }
  return undefined;
}

interface CalendarViewProps {
  days: TripDay[];
  selectedDay: number | null;
  onSelectDay: (dayNumber: number | null) => void;
  mediaCountByDay: Record<number, number>;
  onMediaAdded?: () => void;
  /** When set, calendar opens to the month containing this day and can auto-select it */
  todayDayNumber?: number | null;
}

export function CalendarView({
  days,
  selectedDay,
  onSelectDay,
  mediaCountByDay,
  onMediaAdded,
  todayDayNumber,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (todayDayNumber != null && todayDayNumber >= 1 && todayDayNumber <= 39) {
      const d = new Date(TRIP_START);
      d.setDate(d.getDate() + todayDayNumber - 1);
      return startOfMonth(d);
    }
    return new Date(2025, 2, 1);
  });
  useEffect(() => {
    if (todayDayNumber != null && todayDayNumber >= 1 && todayDayNumber <= 39) {
      const d = new Date(TRIP_START);
      d.setDate(d.getDate() + todayDayNumber - 1);
      setCurrentMonth(startOfMonth(d));
    }
  }, [todayDayNumber]);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const today = new Date();
  const isTodayInTrip =
    today >= TRIP_START && today <= TRIP_END && dateToTripDayNumber(today) != null;

  const canGoPrev = currentMonth.getMonth() > 2 || currentMonth.getFullYear() > 2025;
  const canGoNext = currentMonth.getMonth() < 3 || currentMonth.getFullYear() < 2025;

  const selectedDayData = selectedDay != null ? getDayByNumber(selectedDay) : null;

  return (
    <div className="px-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          disabled={!canGoPrev}
          className="p-2 rounded-full text-text-primary disabled:opacity-30 active:bg-stone-100"
          aria-label="Previous month"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-semibold text-text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          disabled={!canGoNext}
          className="p-2 rounded-full text-text-primary disabled:opacity-30 active:bg-stone-100"
          aria-label="Next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-text-secondary py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((date) => {
          const tripDayNum = dateToTripDayNumber(date);
          const dayData = tripDayNum != null ? getDayByNumber(tripDayNum) : null;
          const isTripDate = tripDayNum != null;
          const isSelected = selectedDay === tripDayNum;
          const isToday = isTodayInTrip && isSameDay(date, today);
          const mediaCount = tripDayNum != null ? mediaCountByDay[tripDayNum] ?? 0 : 0;
          const regionColor = dayData ? REGION_COLORS[dayData.region] : undefined;

          const isTodayTrip = isToday && isTripDate;
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => {
                if (!isTripDate) return;
                onSelectDay(isSelected ? null : tripDayNum);
              }}
              className={`
                min-h-[44px] rounded-lg flex flex-col items-center justify-center py-1 relative
                ${!isTripDate ? 'text-gray-300' : ''}
                ${isTripDate ? 'text-text-primary' : ''}
                ${isSelected ? 'bg-accent text-white shadow-md' : ''}
                ${isTodayTrip && !isSelected ? 'bg-emerald-500 text-white font-bold shadow-md ring-2 ring-emerald-300 ring-offset-1' : ''}
                ${isTripDate && !isSelected && !isTodayTrip ? 'bg-surface hover:bg-stone-50 active:bg-stone-100' : ''}
                ${isToday && !isTripDate ? 'border-2 border-gray-300 rounded-full' : ''}
              `}
            >
              {isTodayTrip && !isSelected ? (
                <span className="w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm">
                  {format(date, 'd')}
                </span>
              ) : (
                <span className="text-sm font-medium">{format(date, 'd')}</span>
              )}
              {isTripDate && regionColor && !isTodayTrip && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5 shrink-0"
                  style={{ backgroundColor: isSelected ? 'white' : regionColor }}
                />
              )}
              {isTripDate && isTodayTrip && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 bg-white/80" />
              )}
              {mediaCount > 0 && (
                <span className="absolute top-0.5 right-0.5 text-[10px]" title={`${mediaCount} photos`}>
                  📷
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail card below calendar */}
      <AnimatePresence mode="wait">
        {selectedDayData && selectedDay != null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-4 overflow-hidden"
          >
            <DayDetailCard
              day={selectedDayData}
              mediaCount={mediaCountByDay[selectedDay] ?? 0}
              onMediaAdded={onMediaAdded ?? (() => {})}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DayDetailCard({
  day,
  mediaCount,
  onMediaAdded,
}: {
  day: TripDay;
  mediaCount: number;
  onMediaAdded: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-divider bg-surface shadow-card overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftColor: REGION_COLORS[day.region] }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] text-text-primary">
            Day {day.dayLabel} · {day.title}
          </h3>
          {day.mapsLink && (
            <MapPinLink href={day.mapsLink} size={16} className="shrink-0" />
          )}
        </div>
        <p className="text-xs text-text-secondary mb-4">{day.date}</p>

        {day.sections.map((sec) => (
          <div key={sec.title} className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5">
              ▾ {sec.title}
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
    </div>
  );
}

export function useMediaCountByDay(): Record<number, number> {
  const [counts, setCounts] = useState<Record<number, number>>({});
  useEffect(() => {
    getMediaCounts().then(setCounts);
  }, []);
  return counts;
}
