'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const SECTION_ACCENT: Record<string, string> = {
  hotels: '#7C3AED',
  dining: '#EA580C',
  flights: '#3B82F6',
  cars: '#059669',
  attractions: '#EC4899',
};

function reservationId(sectionKey: string, title: string): string {
  return `${sectionKey}|${title}`;
}

/** Frosted glass cost summary — Apple Wallet style, editable amounts */
function CostSummaryCard() {
  const costSummary = useStore((s) => s.costSummary);
  const setCostSummaryRow = useStore((s) => s.setCostSummaryRow);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const rows = costSummary.length > 0 ? costSummary : COST_SUMMARY;
  const totalRow = rows.find((r) => r.isTotal);
  const pillRows = rows.filter((r) => !r.isTotal);
  const pillLabels = ['Hotels', 'Flights', 'Cars', 'Tickets'];
  const totalAmount = totalRow?.amount ?? '₪44,000';
  const totalIndex = rows.findIndex((r) => r.isTotal);

  const handleStartEdit = (index: number, current: string) => {
    setEditingIndex(index);
    setEditValue(current);
  };
  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) setCostSummaryRow(index, editValue.trim());
    setEditingIndex(null);
  };

  const totalNum = parseInt((totalRow?.amount ?? '44000').replace(/[^\d]/g, ''), 10) || 44000;
  const perPersonDisplay = `₪${Math.round(totalNum / 2).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <div
      className="relative overflow-hidden rounded-[20px] p-6 mb-6"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">
          TRIP BUDGET
        </p>
        {editingIndex === totalIndex ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSaveEdit(totalIndex)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(totalIndex)}
            autoFocus
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white font-bold w-full max-w-[200px] text-[28px] focus:outline-none focus:ring-2 focus:ring-white/30"
            style={{ letterSpacing: '-0.02em' }}
          />
        ) : (
          <button
            type="button"
            onClick={() => handleStartEdit(totalIndex, totalAmount)}
            className="text-left text-white font-bold mb-0.5 hover:bg-white/5 rounded px-1 -mx-1 transition-colors"
            style={{ fontSize: 36, letterSpacing: '-0.02em', fontWeight: 700 }}
          >
            {totalAmount}
          </button>
        )}
        <p className="text-[13px] text-white/60 mb-6">
          Estimated Total · {perPersonDisplay} per person
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
          {pillRows.slice(0, 4).map((row, i) => {
            const idx = rows.findIndex((r) => r === row);
            const isEditing = editingIndex === idx;
            return (
              <div
                key={row.label}
                className="rounded-[14px] px-4 py-3 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-[20px] mb-1">{['🏨', '✈️', '🚗', '🎫'][i]}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(idx)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(idx)}
                    autoFocus
                    className="bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white font-bold text-sm w-full focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx, row.amount)}
                    className="block text-left w-full text-white font-bold text-sm hover:bg-white/5 rounded py-0.5 -mx-1 transition-colors"
                  >
                    {row.amount}
                  </button>
                )}
                <p className="text-white/50 text-xs mt-0.5">{pillLabels[i] ?? row.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-[12px] text-white/50">
          {COST_SUMMARY_NOTE}
        </p>
      </div>
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
  emoji,
  accentColor,
  index,
}: {
  sectionKey: string;
  title: string;
  details: { label: string; value: string }[];
  price?: string;
  savedLink: string;
  onSaveLink: (url: string) => void;
  emoji: string;
  accentColor: string;
  index: number;
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

  const detailRows = details.filter((d) => d.label !== 'Cost');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="active:scale-[0.99] transition-transform rounded-2xl border border-[#F0EFED] bg-white p-5 mb-3 relative overflow-hidden"
      style={{
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)',
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
      }}
    >
      <p className="text-2xl mb-1" aria-hidden>{emoji}</p>
      <h3 className="text-[16px] font-semibold text-[#1C1917] mb-3">{title}</h3>

      <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-[13px] max-[349px]:grid-cols-1">
        {detailRows.map((d) => (
          <div key={d.label} className="contents">
            <span className="text-[#9CA3AF]">{d.label}</span>
            <span className="text-right text-[#374151] font-medium flex items-center justify-end gap-1.5">
              {d.label === 'Booked via' && d.value.includes('Agoda') && (
                <img src="https://cdn6.agoda.net/images/agoda-logo.svg" alt="" className="h-4 w-auto object-contain" />
              )}
              {d.label === 'Booked via' && d.value.includes('Booking.com') && (
                <img src="https://cf.bstatic.com/static/img/tfl/logo_booking/logo_booking_1x.png" alt="" className="h-4 w-auto object-contain" />
              )}
              {d.value}
            </span>
          </div>
        ))}
      </div>

      {price && (
        <div className="mt-3 text-right">
          <span className="text-lg font-bold text-pink-500">{price}</span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#E7E5E4]">
        <AnimatePresence mode="wait">
          {savedLink ? (
            <motion.div
              key="links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href={savedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[13px] font-semibold min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer touch-manipulation active:scale-95 transition-transform"
                style={{ background: '#FDF2F8', color: '#EC4899' }}
              >
                <ExternalLink size={14} />
                See booking
              </a>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-[12px] font-medium text-[#9CA3AF] min-h-[44px] px-2 cursor-pointer touch-manipulation"
              >
                Edit
              </button>
              <span className="text-[#9CA3AF] text-[12px]">·</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-medium text-[#9CA3AF] min-h-[44px] px-2 cursor-pointer touch-manipulation"
              >
                Remove
              </button>
            </motion.div>
          ) : editing ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                  URL
                </label>
                <input
                  type="url"
                  placeholder="https://agoda.com/booking/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-[14px] text-[#1C1917] placeholder:text-[#9CA3AF] min-h-[44px] focus:outline-none focus:border-pink-500 focus:ring-[3px] focus:ring-pink-500/10"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setInputUrl(savedLink || ''); }}
                  className="text-[14px] font-medium text-[#9CA3AF] min-h-[44px] px-4 cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!inputUrl.trim()}
                  className="rounded-[10px] px-6 py-2.5 text-[14px] font-semibold text-white min-h-[44px] disabled:opacity-50 cursor-pointer touch-manipulation active:scale-95 transition-transform"
                  style={{ background: '#EC4899' }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full rounded-[10px] border-2 border-dashed border-[#E5E7EB] py-2.5 text-[13px] text-[#9CA3AF] font-medium min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation hover:border-[#D1D5DB] hover:text-[#6B7280] transition-colors"
              >
                <LinkIcon size={16} />
                Add booking link
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
          const accentColor = SECTION_ACCENT[item.sectionKey] ?? '#EC4899';

          return (
            <div
              key={id}
              className="rounded-2xl border border-[#F0EFED] bg-white overflow-hidden mb-2 last:mb-0"
              style={{
                marginTop: index === 0 ? 0 : -28,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
                borderLeftWidth: 3,
                borderLeftColor: accentColor,
              }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                    {item.sectionTitle}
                  </span>
                </div>
                <div className="font-semibold text-[15px] text-[#1C1917] mb-2">
                  {item.reservation.title}
                </div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                  {item.reservation.details.slice(0, 4).map((d) => (
                    <div key={d.label} className="flex justify-between gap-1">
                      <dt className="text-[#9CA3AF]">{d.label}</dt>
                      <dd className="font-medium text-right text-[#374151] truncate max-w-[120px]">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {item.reservation.price && (
                  <div className="mt-1.5 font-bold text-pink-500 text-sm">{item.reservation.price}</div>
                )}
                <div className="mt-3 pt-3 border-t border-[#E7E5E4]">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-semibold min-h-[44px] items-center cursor-pointer touch-manipulation active:scale-95 transition-transform"
                      style={{ background: '#FDF2F8', color: '#EC4899' }}
                    >
                      <ExternalLink size={12} />
                      See booking
                    </a>
                  ) : (
                    <span className="text-xs text-[#9CA3AF]">Add link in List view</span>
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
    <PageTransition className="overflow-touch relative z-0 bg-[#FAFAF9]">
      <div className="px-4 pt-4 pb-[100px] max-w-[640px] mx-auto">
        <h1 className="text-[28px] font-bold text-[#1C1917] mb-5">
          Bookings
        </h1>

        <div
          className="mb-6 p-4 rounded-2xl border-2 border-pink-500/30 bg-pink-50/50"
          data-bookings-version="links-wallet"
        >
          <p className="text-xs font-semibold text-[#1C1917] mb-3">
            Add booking links below each card · Switch to Wallet for stack view
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#78716C]">List</span>
            <button
              type="button"
              role="switch"
              aria-checked={bookingsWalletView}
              onClick={() => setBookingsWalletView(!bookingsWalletView)}
              className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer touch-manipulation ${
                bookingsWalletView ? 'bg-pink-500' : 'bg-[#E5E7EB]'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 pointer-events-none ${
                  bookingsWalletView ? 'left-6' : 'left-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#1C1917]">Wallet stack</span>
          </div>
        </div>

        <CostSummaryCard />

        {bookingsWalletView ? (
          <section className="mt-8">
            <h2 className="text-base font-bold text-[#1C1917] mb-3">All bookings by date</h2>
            <WalletStackView bookingLinks={bookingLinks} />
          </section>
        ) : (
          <>
            {SECTIONS.map((sec) => (
              <section key={sec.key} className="mt-8 mb-4">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[20px] font-bold text-[#1C1917]">{sec.title}</h2>
                  <span className="text-[13px] text-[#78716C]">
                    {sec.reservations.length} booking{sec.reservations.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="border-b border-[#E7E5E4] pb-4" />
                <div className="pt-4">
                  {sec.reservations.map((r, i) => (
                    <ReservationCard
                      key={r.title}
                      sectionKey={sec.key}
                      title={r.title}
                      details={r.details}
                      price={r.price}
                      savedLink={bookingLinks[reservationId(sec.key, r.title)] ?? ''}
                      onSaveLink={(url) => setBookingLink(reservationId(sec.key, r.title), url)}
                      emoji={sec.emoji}
                      accentColor={SECTION_ACCENT[sec.key] ?? '#EC4899'}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </PageTransition>
  );
}
