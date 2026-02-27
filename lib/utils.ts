export const TRIP_START = new Date(2025, 2, 7); // Mar 7, 2025
export const TRIP_END = new Date(2025, 3, 14);   // Apr 14, 2025

/** Returns 1–39 if today is within the trip, else null. Use with optional override for debugging. */
export function getTodayDayNumber(override?: number | null): number | null {
  if (override != null && override >= 1 && override <= 39) return override;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate());
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayNumber = diffDays + 1;
  if (dayNumber >= 1 && dayNumber <= 39) return dayNumber;
  return null;
}

/** True if current date is before trip start. */
export function isBeforeTrip(): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today < new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate());
}

/** True if current date is after trip end. */
export function isAfterTrip(): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today > new Date(TRIP_END.getFullYear(), TRIP_END.getMonth(), TRIP_END.getDate());
}

export function isTripDayToday(dayNumber: number): boolean {
  if (typeof window === 'undefined') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDate = new Date(TRIP_START);
  dayDate.setDate(dayDate.getDate() + dayNumber - 1);
  dayDate.setHours(0, 0, 0, 0);
  return today.getTime() === dayDate.getTime();
}

export function openMapsLink(url: string): void {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Parse first date from reservation details (Dates or Date) for sorting. Returns YYYY-MM-DD or '' */
export function parseReservationSortDate(details: { label: string; value: string }[]): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const dateDetail = details.find(
    (d) => d.label === 'Dates' || d.label === 'Date'
  );
  if (!dateDetail) return '';
  const v = dateDetail.value;
  const m = v.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})/i);
  if (!m) return '';
  const mon = m[1].slice(0, 3);
  const month = months[mon] || '01';
  const day = m[2].padStart(2, '0');
  const year = '2025';
  return `${year}-${month}-${day}`;
}
