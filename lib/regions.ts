import type { Region } from './types';

export const REGION_COLORS: Record<Region, string> = {
  tokyo: '#DC2626',
  kyoto: '#7C3AED',
  osaka: '#EA580C',
  rural: '#059669',
  kyushu: '#0284C7',
  okinawa: '#0891B2',
  aso: '#65A30D',
};

export const REGION_LABELS: Record<Region, string> = {
  tokyo: 'Tokyo',
  kyoto: 'Kyoto',
  osaka: 'Osaka',
  rural: 'Central Japan',
  kyushu: 'Kyushu',
  okinawa: 'Okinawa',
  aso: 'Aso',
};

export const REGION_TAILWIND: Record<Region, string> = {
  tokyo: 'bg-tokyo',
  kyoto: 'bg-kyoto',
  osaka: 'bg-osaka',
  rural: 'bg-rural',
  kyushu: 'bg-kyushu',
  okinawa: 'bg-okinawa',
  aso: 'bg-aso',
};
