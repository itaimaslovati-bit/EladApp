/** Firestore uses string keys; synced data shape (no Firebase deps) */
export interface TripSyncData {
  checklist: Record<string, boolean>;
  toBookChecked: Record<string, boolean>;
  packingChecked: Record<string, boolean>;
  bookingLinks: Record<string, string>;
  dayCaptions: Record<string, string>;
}
