export type Region =
  | 'tokyo'
  | 'kyoto'
  | 'osaka'
  | 'rural'
  | 'kyushu'
  | 'okinawa'
  | 'aso';

export interface DayItem {
  text: string;
  isHighlight?: boolean;
  mapsLink?: string;
  tip?: string;
}

export interface DaySection {
  title: string;
  items: DayItem[];
}

export interface TripDay {
  dayNumber: number;
  dayLabel: string; // "1", "2", "29-31", etc.
  title: string;
  date: string;
  region: Region;
  hotel?: { name: string; emoji: string };
  mapsLink?: string;
  sections: DaySection[];
  tags?: string[];
  travelBadge?: string;
}

export interface OverviewDay {
  dayNumber: number;
  title: string;
  date: string;
  region: Region;
  hotel?: { name: string; emoji: string };
  mapsLink?: string;
  travelBadge?: string;
}

export interface Reservation {
  title: string;
  details: { label: string; value: string }[];
  price?: string;
}

export interface TransportLeg {
  dayLabel: string;
  route: string;
  method: string;
  details: string;
  tip?: string;
}

export interface TransportRegion {
  title: string;
  legs: TransportLeg[];
}

export interface FoodItem {
  emoji: string;
  name: string;
  description: string;
}

export interface FoodRegion {
  title: string;
  items: FoodItem[];
}

export interface EmergencyItem {
  label: string;
  value: string;
  big?: boolean;
}

export interface EmergencyCard {
  title: string;
  urgent?: boolean;
  items: EmergencyItem[];
}

export interface PhraseEntry {
  en: string;
  jp: string;
}

export interface PhraseCategory {
  title: string;
  phrases: PhraseEntry[];
}

export interface PackingItem {
  text: string;
  note?: string;
}

export interface PackingSection {
  title: string;
  items: PackingItem[];
  note?: string;
}

export interface ChecklistCategory {
  category: string;
  items: string[];
}

export type TodoUrgency = 'high' | 'med' | 'low';

export interface TodoItem {
  title: string;
  detail: string;
  when: string;
  urgency: TodoUrgency;
  booked?: boolean;
}

export interface IdeaItem {
  region: string;
  regionColor: string;
  title: string;
  description: string;
  fit: string;
}

export interface CostRow {
  label: string;
  amount: string;
  isTotal?: boolean;
}
