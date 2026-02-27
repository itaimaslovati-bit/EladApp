'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { MapPinLink } from '@/components/ui/MapPinLink';
import { MediaUploader } from '@/components/ui/MediaUploader';
import { TipBubble } from '@/components/ui/TipBubble';
import { getTodayDayNumber, isBeforeTrip, isAfterTrip, TRIP_START } from '@/lib/utils';
import { assembleTodayData } from '@/lib/today';
import { REGION_LABELS } from '@/lib/regions';
import { useStore } from '@/lib/store';
import { getMediaCounts, getAllMedia } from '@/lib/mediaStorage';
import { ExternalLink } from 'lucide-react';
import type { Region } from '@/lib/types';

function reservationId(sectionKey: string, title: string): string {
  return `${sectionKey}|${title}`;
}

function PostTripContent() {
  const [stats, setStats] = useState({ photos: 0, videos: 0 });
  useEffect(() => {
    getAllMedia().then((all) => {
      setStats({
        photos: all.filter((m) => m.type === 'image').length,
        videos: all.filter((m) => m.type === 'video').length,
      });
    });
  }, []);
  return (
    <div className="px-4 pt-2 pb-4">
      <h1 className="text-[28px] font-bold text-text-primary">Today</h1>
      <p className="text-text-secondary mt-1">Hope you had an incredible trip! 🌸</p>
      <p className="text-sm text-text-secondary mt-4">
        {stats.photos} photos · {stats.videos} videos captured
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/memories" className="px-4 py-3 rounded-xl bg-accent/10 text-accent font-medium text-sm text-center">
          View All Memories
        </Link>
        <Link href="/memories" className="px-4 py-3 rounded-xl border border-divider font-medium text-sm text-center text-text-primary">
          Download Trip Album (from Memories)
        </Link>
      </div>
    </div>
  );
}

export default function TodayPage() {
  const { debugDayOverride, setDebugDayOverride, bookingLinks } = useStore();
  const dayNumber = debugDayOverride ?? getTodayDayNumber();
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDebugPicker, setShowDebugPicker] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);
  useEffect(() => {
    if (dayNumber != null && dayNumber >= 1 && dayNumber <= 39) {
      getMediaCounts().then((c) => setMediaCount(c[dayNumber] ?? 0));
    }
  }, [dayNumber]);

  const handleHeaderTap = () => {
    setTapCount((c) => c + 1);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      if (tapCount + 1 >= 3) setShowDebugPicker(true);
      setTapCount(0);
      tapTimerRef.current = null;
    }, 400);
  };

  // Pre-trip
  if (dayNumber == null && isBeforeTrip()) {
    const start = new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysUntil = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return (
      <PageTransition className="pb-6">
        <div className="px-4 pt-2 pb-4">
          <h1 className="text-[28px] font-bold text-text-primary">Today</h1>
          <p className="text-text-secondary mt-1">Your adventure begins in {daysUntil} days! 🇯🇵</p>
          <p className="text-sm text-text-secondary mt-4">Trip starts March 7, 2025</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/checklist" className="px-4 py-3 rounded-xl bg-accent/10 text-accent font-medium text-sm">
              Checklist
            </Link>
            <Link href="/packing" className="px-4 py-3 rounded-xl bg-accent/10 text-accent font-medium text-sm">
              Packing
            </Link>
            <Link href="/to-book" className="px-4 py-3 rounded-xl bg-accent/10 text-accent font-medium text-sm">
              To Book
            </Link>
          </div>
          <p className="text-xs text-text-secondary mt-6">Make sure everything is ready!</p>
        </div>
      </PageTransition>
    );
  }

  // Post-trip
  if (dayNumber == null && isAfterTrip()) {
    return (
      <PageTransition className="pb-6">
        <PostTripContent />
      </PageTransition>
    );
  }

  // During trip
  if (dayNumber == null) return null;
  const data = assembleTodayData(dayNumber);
  const { day, hotel, isCheckIn, isCheckOut, transportLegs, diningReservations, attractions, carRental, tips, tomorrowDay } = data;

  return (
    <PageTransition className="pb-6 overflow-touch">
      <div className="px-4 pt-2">
        <button type="button" onClick={handleHeaderTap} className="text-left w-full">
          <h1 className="text-[28px] font-bold text-text-primary">Day {day.dayLabel}</h1>
          <p className="text-lg text-text-primary font-medium mt-0.5">{day.title}</p>
          <p className="text-sm text-text-secondary mt-0.5">{day.date}</p>
          <p className="text-xs text-text-secondary mt-1">{REGION_LABELS[day.region as Region]}</p>
        </button>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
              style={{ width: `${(dayNumber / 39) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{dayNumber}/39</span>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Stay */}
        {hotel && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">🏨 Stay</h2>
            <div className="rounded-xl border border-divider bg-surface p-4">
              <div className="font-semibold text-text-primary">{hotel.title}</div>
              {(isCheckIn || isCheckOut) && (
                <p className="text-xs text-accent font-medium mt-1">
                  {isCheckIn ? 'Check-in today' : isCheckOut ? 'Check-out tomorrow' : ''}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {bookingLinks[reservationId('hotels', hotel.title)] && (
                  <a
                    href={bookingLinks[reservationId('hotels', hotel.title)]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent text-sm font-medium"
                  >
                    <ExternalLink size={14} /> Confirmation
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Today's Plan */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">📋 Today&apos;s Plan</h2>
          <div className="rounded-xl border border-divider bg-surface p-4 space-y-4">
            {day.sections.map((sec) => (
              <div key={sec.title}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-1.5">
                  ▸ {sec.title}
                </div>
                <ul className="space-y-1.5">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[15px] leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-secondary shrink-0 mt-2" />
                      <span className="flex-1 min-w-0">
                        {item.text}
                        {item.tip && <TipBubble tip={item.tip} className="inline-flex ml-0.5" />}
                      </span>
                      {item.mapsLink && <MapPinLink href={item.mapsLink} size={14} className="shrink-0" />}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Transport */}
        {transportLegs.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">🚗 Transport</h2>
            <div className="space-y-2">
              {transportLegs.map((leg, i) => (
                <div key={i} className="rounded-xl border border-divider bg-surface p-4">
                  <div className="font-semibold text-text-primary">{leg.method}</div>
                  <div className="text-sm text-text-secondary mt-0.5">{leg.route}</div>
                  <p className="text-xs text-text-secondary mt-2">{leg.details}</p>
                  {leg.tip && (
                    <div className="mt-2 pl-2 border-l-2 border-amber-200 bg-amber-50 rounded text-xs text-amber-900">
                      {leg.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dining */}
        {diningReservations.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">🍽️ Dining</h2>
            {diningReservations.map((r) => (
              <div key={r.title} className="rounded-xl border border-divider bg-surface p-4 mb-2">
                <div className="font-semibold text-text-primary">{r.title}</div>
                <p className="text-xs text-text-secondary mt-1">
                  {r.details.find((d) => d.label === 'Date')?.value} · {r.details.find((d) => d.label === 'Location')?.value}
                </p>
                {bookingLinks[reservationId('dining', r.title)] && (
                  <a href={bookingLinks[reservationId('dining', r.title)]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent text-sm mt-2">
                    <ExternalLink size={14} /> Reservation
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tickets */}
        {attractions.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">🎫 Tickets</h2>
            {attractions.map((r) => (
              <div key={r.title} className="rounded-xl border border-divider bg-surface p-4 mb-2">
                <div className="font-semibold text-text-primary">{r.title}</div>
                <p className="text-xs text-text-secondary mt-1">{r.details.find((d) => d.label === 'Booked via')?.value} · {r.price}</p>
                {bookingLinks[reservationId('attractions', r.title)] && (
                  <a href={bookingLinks[reservationId('attractions', r.title)]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent text-sm mt-2">
                    <ExternalLink size={14} /> Voucher
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">💡 Tips for Today</h2>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div key={i} className="pl-2 border-l-2 border-amber-200 bg-amber-50 rounded-r-lg p-3 text-sm text-amber-900">
                  {tip}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Memories */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">📸 Today&apos;s Memories {mediaCount > 0 ? `(${mediaCount})` : ''}</h2>
          <MediaUploader dayNumber={dayNumber} onMediaAdded={() => getMediaCounts().then((c) => setMediaCount(c[dayNumber] ?? 0))} />
        </section>

        {/* Tomorrow */}
        {tomorrowDay && (
          <section>
            <Link
              href={`/days/${tomorrowDay.dayNumber}`}
              className="block rounded-xl border border-divider bg-surface p-4 active:scale-[0.99]"
            >
              <p className="text-xs text-text-secondary">Tomorrow</p>
              <p className="font-semibold text-text-primary mt-0.5">Day {tomorrowDay.dayLabel} · {tomorrowDay.title}</p>
              {tomorrowDay.hotel && (
                <p className="text-xs text-text-secondary mt-1">🏨 {tomorrowDay.hotel.name}</p>
              )}
            </Link>
          </section>
        )}
      </div>

      {/* Debug day picker */}
      {showDebugPicker && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowDebugPicker(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-text-primary mb-2">Debug: Simulate day</h3>
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {Array.from({ length: 39 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDebugDayOverride(d); setShowDebugPicker(false); }}
                  className="py-2 rounded-lg border border-divider text-sm font-medium"
                >
                  {d}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => { setDebugDayOverride(null); setShowDebugPicker(false); }} className="mt-4 w-full py-2 rounded-lg bg-gray-100 text-sm">
              Clear (use real date)
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
