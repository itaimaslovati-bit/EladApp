import type { TripDay, Reservation, TransportLeg } from './types';
import { TRIP_DAYS } from './tripDays';
import {
  RESERVATIONS_HOTELS,
  RESERVATIONS_DINING,
  RESERVATIONS_ATTRACTIONS,
  RESERVATIONS_CARS,
  TRANSPORT_REGIONS,
} from './data';
import { findDayByNumber } from './tripDays';
import { TRIP_START } from './utils';

/** Parse "Mar 7" or "Apr 14" to trip day number (1-39). */
function parseDateToDayNumber(str: string): number | null {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const m = str.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})/i);
  if (!m) return null;
  const month = months[m[1].slice(0, 3)] ?? 0;
  const day = parseInt(m[2], 10);
  const d = new Date(2025, month, day);
  const start = new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate());
  const diffMs = d.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const dayNum = diffDays + 1;
  if (dayNum >= 1 && dayNum <= 39) return dayNum;
  return null;
}

/** Parse "Mar 7-11" or "Mar 30 - Apr 3" to [startDay, endDayExclusive). Stay covers startDay..endDayExclusive-1. */
function parseHotelDateRange(datesValue: string): { start: number; endExclusive: number } | null {
  const twoMonth = datesValue.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})\s*[-–]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})/i);
  if (twoMonth) {
    const startStr = `${twoMonth[1]} ${twoMonth[2]}`;
    const endStr = `${twoMonth[3]} ${twoMonth[4]}`;
    const startDay = parseDateToDayNumber(startStr);
    const endDay = parseDateToDayNumber(endStr);
    if (startDay != null && endDay != null) return { start: startDay, endExclusive: endDay };
  }
  const oneMonth = datesValue.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})\s*[-–]\s*(\d{1,2})/i);
  if (oneMonth) {
    const startStr = `${oneMonth[1]} ${oneMonth[2]}`;
    const endStr = `${oneMonth[1]} ${oneMonth[3]}`;
    const startDay = parseDateToDayNumber(startStr);
    const endDay = parseDateToDayNumber(endStr);
    if (startDay != null && endDay != null) return { start: startDay, endExclusive: endDay };
  }
  const single = datesValue.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\.?\s*(\d{1,2})/i);
  if (single) {
    const d = parseDateToDayNumber(`${single[1]} ${single[2]}`);
    if (d != null) return { start: d, endExclusive: d + 1 };
  }
  return null;
}

/** Parse "Day 4" or "Day 12" from details. */
function parseDayFromDetail(details: { label: string; value: string }[], labelName: string): number | null {
  const detail = details.find((d) => d.label === labelName);
  if (!detail) return null;
  const m = detail.value.match(/Day\s*(\d+)/i) || detail.value.match(/(\d+)/);
  if (m) return parseInt(m[1], 10);
  const dateDetail = details.find((d) => d.label === 'Date');
  if (dateDetail) return parseDateToDayNumber(dateDetail.value);
  return null;
}

/** Check if transport leg dayLabel matches dayNumber (e.g. "DAY 12" or "DAYS 12-15"). */
function transportLegMatchesDay(dayLabel: string, dayNumber: number): boolean {
  const single = dayLabel.match(/DAY\s*(\d+)/i);
  if (single) return parseInt(single[1], 10) === dayNumber;
  const range = dayLabel.match(/DAYS\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (range) {
    const a = parseInt(range[1], 10);
    const b = parseInt(range[2], 10);
    return dayNumber >= a && dayNumber <= b;
  }
  return false;
}

export interface TodayData {
  day: TripDay;
  hotel: Reservation | null;
  isCheckIn: boolean;
  isCheckOut: boolean;
  transportLegs: TransportLeg[];
  diningReservations: Reservation[];
  attractions: Reservation[];
  carRental: Reservation | null;
  tips: string[];
  tomorrowDay: TripDay | null;
}

export function assembleTodayData(dayNumber: number): TodayData {
  const day = findDayByNumber(dayNumber);
  if (!day) throw new Error(`Day ${dayNumber} not found`);

  let hotel: Reservation | null = null;
  let isCheckIn = false;
  let isCheckOut = false;
  for (const h of RESERVATIONS_HOTELS) {
    const datesDetail = h.details.find((d) => d.label === 'Dates');
    if (!datesDetail) continue;
    const range = parseHotelDateRange(datesDetail.value);
    if (!range) continue;
    if (dayNumber >= range.start && dayNumber < range.endExclusive) {
      hotel = h;
      isCheckIn = dayNumber === range.start;
      isCheckOut = dayNumber === range.endExclusive - 1;
      break;
    }
  }

  const transportLegs: TransportLeg[] = [];
  for (const region of TRANSPORT_REGIONS) {
    for (const leg of region.legs) {
      if (transportLegMatchesDay(leg.dayLabel, dayNumber)) {
        transportLegs.push(leg);
      }
    }
  }

  const diningReservations = RESERVATIONS_DINING.filter((r) => {
    const d = parseDayFromDetail(r.details, 'Day');
    return d === dayNumber;
  });

  const attractions = RESERVATIONS_ATTRACTIONS.filter((r) => {
    const d = parseDayFromDetail(r.details, 'Date');
    return d === dayNumber;
  });

  let carRental: Reservation | null = null;
  for (const c of RESERVATIONS_CARS) {
    const datesDetail = c.details.find((d) => d.label === 'Dates');
    if (!datesDetail) continue;
    const v = datesDetail.value;
    const arrow = v.match(/(\w+\s+\d+)\s*[→\-–]\s*(\w+\s+\d+)/i) || v.match(/(\w+\s+\d+)\s*-\s*(\w+\s+\d+)/i);
    if (arrow) {
      const start = parseDateToDayNumber(arrow[1].trim());
      const end = parseDateToDayNumber(arrow[2].trim());
      if (start != null && end != null && dayNumber >= start && dayNumber <= end) {
        carRental = c;
        break;
      }
    }
  }

  const tips: string[] = [];
  for (const sec of day.sections) {
    for (const item of sec.items) {
      if (item.tip) tips.push(item.tip);
    }
  }

  const tomorrowDay = findDayByNumber(dayNumber + 1) ?? null;

  return {
    day,
    hotel,
    isCheckIn,
    isCheckOut,
    transportLegs,
    diningReservations,
    attractions,
    carRental,
    tips,
    tomorrowDay,
  };
}
