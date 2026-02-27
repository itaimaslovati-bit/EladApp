'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { useStore } from '@/lib/store';
import { parseReservationSortDate } from '@/lib/utils';
import {
  COST_SUMMARY,
  COST_SUMMARY_NOTE,
  RESERVATIONS_HOTELS,
  RESERVATIONS_DINING,
  RESERVATIONS_FLIGHTS,
  RESERVATIONS_CARS,
  RESERVATIONS_ATTRACTIONS,
} from '@/lib/data';
import type { Reservation } from '@/lib/types';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

const SECTIONS: { key: string; title: string; emoji: string; reservations: Reservation[] }[] = [
  { key: 'hotels', title: 'Hotels', emoji: '🏨', reservations: RESERVATIONS_HOTELS },
  { key: 'dining', title: 'Dining', emoji: '🍽️', reservations: RESERVATIONS_DINING },
  { key: 'flights', title: 'Flights', emoji: '✈️', reservations: RESERVATIONS_FLIGHTS },
  { key: 'cars', title: 'Car Rentals', emoji: '🚗', reservations: RESERVATIONS_CARS },
  { key: 'attractions', title: 'Attractions', emoji: '🎫', reservations: RESERVATIONS_ATTRACTIONS },
];

function reservationId(sectionKey: string, title: string): string {
  return `${sectionKey}|${title}`;
}

function CostSummaryCard() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-700 text-white p-5 mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
        Cost Summary (NIS)
      </h3>
      <div className="space-y-1.5">
        {COST_SUMMARY.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between text-sm ${row.isTotal ? 'border-t border-stone-600 pt-3 mt-2 font-bold text-base' : ''}`}
          >
            <span className={row.isTotal ? 'text-stone-200' : 'text-stone-300'}>{row.label}</span>
            <span className="font-semibold">{row.amount}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500 mt-3">{COST_SUMMARY_NOTE}</p>
      <p className="text-accent-light text-sm font-semibold mt-2">~22,000 NIS per person</p>
    </div>
  );
}

function ReservationCard({
  sectionKey,
  title,
  details,
  price,
  savedLink,
  onSaveLink,
  compact,
}: {
  sectionKey: string;
  title: string;
  details: { label: string; value: string }[];
  price?: string;
  savedLink: string;
  onSaveLink: (url: string) => void;
  compact?: boolean;
}) {
  const [inputUrl, setInputUrl] = useState(savedLink || '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setInputUrl(savedLink || '');
  }, [savedLink]);

  const handleSave = () => {
    const trimmed = inputUrl.trim();
    if (trimmed) {
      onSaveLink(trimmed);
      setEditing(false);
    }
  };

  const handleClear = () => {
    setInputUrl('');
    onSaveLink('');
    setEditing(true);
  };

  return (
    <div className={`rounded-xl border border-divider bg-surface p-4 mb-2 relative z-0 ${compact ? 'shadow-card' : ''}`}>
      <div className="font-semibold text-[15px] text-text-primary mb-1">{title}</div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between gap-2">
            <dt className="text-text-secondary">{d.label}</dt>
            <dd className={`font-medium text-right ${d.label === 'Cost' ? 'text-accent' : ''}`}>
              {d.value}
            </dd>
          </div>
        ))}
      </dl>
      {price && (
        <div className="mt-2 font-bold text-accent text-sm">{price}</div>
      )}

      {/* Booking link: add / edit / see */}
      <div className="mt-3 pt-3 border-t-2 border-divider">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Booking link
        </p>
        {savedLink ? (
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={savedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent/10 text-accent font-medium text-sm min-h-[44px] cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <ExternalLink size={14} />
              See booking
            </a>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-text-secondary underline min-h-[44px] px-2 cursor-pointer touch-manipulation"
            >
              Change link
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-text-secondary underline min-h-[44px] px-2 cursor-pointer touch-manipulation"
            >
              Remove
            </button>
          </div>
        ) : editing ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste booking or confirmation URL"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 min-w-0 rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!inputUrl.trim()}
                className="shrink-0 px-4 py-2.5 rounded-lg bg-accent text-white font-medium text-sm min-h-[44px] disabled:opacity-50 cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-sm text-accent font-medium min-h-[44px] py-2 px-0 cursor-pointer touch-manipulation w-full text-left"
          >
            <LinkIcon size={16} />
            Add booking link
          </button>
        )}
      </div>
    </div>
  );
}

/** All reservations flattened with section + sort date for wallet view */
function getAllReservationsSorted(): { sectionKey: string; sectionTitle: string; emoji: string; reservation: Reservation; sortDate: string }[] {
  const out: { sectionKey: string; sectionTitle: string; emoji: string; reservation: Reservation; sortDate: string }[] = [];
  for (const sec of SECTIONS) {
    for (const r of sec.reservations) {
      out.push({
        sectionKey: sec.key,
        sectionTitle: sec.title,
        emoji: sec.emoji,
        reservation: r,
        sortDate: parseReservationSortDate(r.details),
      });
    }
  }
  out.sort((a, b) => (a.sortDate || '9999-99-99').localeCompare(b.sortDate || '9999-99-99'));
  return out;
}

function WalletStackView({
  bookingLinks,
}: {
  bookingLinks: Record<string, string>;
}) {
  const items = getAllReservationsSorted();

  return (
    <div className="overflow-y-auto overflow-x-hidden -mx-4 px-4" style={{ maxHeight: '60vh' }}>
      <div className="relative pt-2 pb-6">
        {items.map((item, index) => {
          const id = reservationId(item.sectionKey, item.reservation.title);
          const link = bookingLinks[id] ?? '';
          const scale = 1 - Math.min(index * 0.015, 0.2);

          return (
            <div
              key={id}
              className="rounded-2xl border border-divider bg-surface shadow-card overflow-hidden mb-2 last:mb-0"
              style={{
                marginTop: index === 0 ? 0 : -28,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    {item.sectionTitle}
                  </span>
                </div>
                <div className="font-semibold text-[15px] text-text-primary mb-2">
                  {item.reservation.title}
                </div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                  {item.reservation.details.slice(0, 4).map((d) => (
                    <div key={d.label} className="flex justify-between gap-1">
                      <dt className="text-text-secondary">{d.label}</dt>
                      <dd className="font-medium text-right truncate max-w-[120px]">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {item.reservation.price && (
                  <div className="mt-1.5 font-bold text-accent text-xs">{item.reservation.price}</div>
                )}
                <div className="mt-3 pt-2 border-t border-divider">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-accent/10 text-accent font-medium text-xs min-h-[44px] items-center cursor-pointer touch-manipulation active:scale-[0.98]"
                    >
                      <ExternalLink size={12} />
                      See booking
                    </a>
                  ) : (
                    <span className="text-xs text-text-secondary">Add link in List view</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { bookingLinks, setBookingLink, bookingsWalletView, setBookingsWalletView } = useStore();

  return (
    <PageTransition className="pb-6 overflow-touch relative z-0">
      <div className="px-4 pt-2 pb-2">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-text-primary">
          Bookings
        </h1>
        <p className="text-[15px] text-text-secondary mt-0.5">Reservations & costs · Links & wallet</p>
      </div>

      {/* Prominent bar: View toggle + hint — visible so you know this build is current */}
      <div
        className="mx-4 mb-4 p-4 rounded-2xl border-2 border-accent/30 bg-accent-light/30"
        data-bookings-version="links-wallet"
      >
        <p className="text-xs font-semibold text-text-primary mb-3">
          📎 Add booking links below each card • Switch to Wallet for stack view
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">List</span>
          <button
            type="button"
            role="switch"
            aria-checked={bookingsWalletView}
            onClick={() => setBookingsWalletView(!bookingsWalletView)}
            className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer touch-manipulation ${
              bookingsWalletView ? 'bg-accent' : 'bg-divider'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 pointer-events-none ${
                bookingsWalletView ? 'left-6' : 'left-1'
              }`}
            />
          </button>
          <span className="text-sm font-medium text-text-primary">Wallet stack</span>
        </div>
      </div>

      <div className="px-4">
        <CostSummaryCard />

        {bookingsWalletView ? (
          <section className="mt-6">
            <h2 className="text-base font-bold mb-3">All bookings by date</h2>
            <WalletStackView bookingLinks={bookingLinks} />
          </section>
        ) : (
          <>
            {SECTIONS.map((sec) => (
              <section key={sec.key} className="mb-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-3">
                  {sec.emoji} {sec.title}
                </h2>
                {sec.reservations.map((r) => (
                  <ReservationCard
                    key={r.title}
                    sectionKey={sec.key}
                    title={r.title}
                    details={r.details}
                    price={r.price}
                    savedLink={bookingLinks[reservationId(sec.key, r.title)] ?? ''}
                    onSaveLink={(url) => setBookingLink(reservationId(sec.key, r.title), url)}
                  />
                ))}
              </section>
            ))}
          </>
        )}
      </div>
    </PageTransition>
  );
}
