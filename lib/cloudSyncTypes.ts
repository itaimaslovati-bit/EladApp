/** User-added packing item (category = section title) */
export interface UserPackingItem {
  id: string;
  category: string;
  text: string;
}

/** User-added food item (region = FOOD_REGIONS title or slug) */
export interface UserFoodItem {
  id: string;
  region: string;
  name: string;
  description: string;
  emoji: string;
  googleLink?: string;
}

/** User-added to-book item */
export interface UserToBookItem {
  id: string;
  title: string;
  detail: string;
  urgency: 'high' | 'med' | 'low';
}

/** User-added idea */
export interface UserIdeaItem {
  id: string;
  region: string;
  title: string;
  description: string;
  fit: string;
}

/** User-added phrase (category = PHRASE_CATEGORIES title) */
export interface UserPhraseItem {
  id: string;
  category: string;
  english: string;
  japanese: string;
}

/** Editable trip budget row */
export interface CostSummaryRow {
  label: string;
  amount: string;
  isTotal?: boolean;
}

/** Firestore uses string keys; synced data shape (no Firebase deps) */
export interface TripSyncData {
  checklist: Record<string, boolean>;
  toBookChecked: Record<string, boolean>;
  packingChecked: Record<string, boolean>;
  bookingLinks: Record<string, string>;
  dayCaptions: Record<string, string>;
  costSummary: CostSummaryRow[];
  userPacking: UserPackingItem[];
  userFood: UserFoodItem[];
  userToBook: UserToBookItem[];
  userIdeas: UserIdeaItem[];
  userPhrases: UserPhraseItem[];
}
