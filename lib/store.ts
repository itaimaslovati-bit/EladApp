import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKLIST_ITEMS_FLAT } from './data';

interface AppState {
  checklist: Record<number, boolean>;
  toggleChecklist: (index: number) => void;
  resetChecklist: () => void;
  iranDismissed: boolean;
  setIranDismissed: () => void;
  currentDayBookmark: number | null;
  setCurrentDayBookmark: (day: number | null) => void;
  // Booking links: key = reservationId (e.g. "hotels|Hotel Century Southern Tower")
  bookingLinks: Record<string, string>;
  setBookingLink: (reservationId: string, url: string) => void;
  // Wallet view toggle for bookings page
  bookingsWalletView: boolean;
  setBookingsWalletView: (value: boolean) => void;
  // Day-by-day: Calendar vs List view
  daysViewMode: 'calendar' | 'list';
  setDaysViewMode: (mode: 'calendar' | 'list') => void;
  selectedCalendarDay: number | null;
  setSelectedCalendarDay: (day: number | null) => void;
  // Day captions for Memories (day number → caption text, 280 char max)
  dayCaptions: Record<number, string>;
  setDayCaption: (dayNumber: number, caption: string) => void;
  // Debug: override "today" for testing (e.g. triple-tap Today header). Not persisted.
  debugDayOverride: number | null;
  setDebugDayOverride: (day: number | null) => void;
}

const defaultChecklist: Record<number, boolean> = {};
CHECKLIST_ITEMS_FLAT.forEach((_, i) => {
  defaultChecklist[i] = false;
});

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      checklist: defaultChecklist,
      toggleChecklist: (index) =>
        set((state) => ({
          checklist: {
            ...state.checklist,
            [index]: !state.checklist[index],
          },
        })),
      resetChecklist: () => set({ checklist: defaultChecklist }),
      iranDismissed: false,
      setIranDismissed: () => set({ iranDismissed: true }),
      currentDayBookmark: null,
      setCurrentDayBookmark: (day) => set({ currentDayBookmark: day }),
      bookingLinks: {},
      setBookingLink: (reservationId, url) =>
        set((state) => ({
          bookingLinks: url
            ? { ...state.bookingLinks, [reservationId]: url }
            : (() => {
                const next = { ...state.bookingLinks };
                delete next[reservationId];
                return next;
              })(),
        })),
      bookingsWalletView: false,
      setBookingsWalletView: (value) => set({ bookingsWalletView: value }),
      daysViewMode: 'list',
      setDaysViewMode: (mode) => set({ daysViewMode: mode }),
      selectedCalendarDay: null,
      setSelectedCalendarDay: (day) => set({ selectedCalendarDay: day }),
      dayCaptions: {},
      setDayCaption: (dayNumber, caption) =>
        set((state) => ({
          dayCaptions: {
            ...state.dayCaptions,
            [dayNumber]: caption.slice(0, 280),
          },
        })),
      debugDayOverride: null,
      setDebugDayOverride: (day) => set({ debugDayOverride: day }),
    }),
    {
      name: 'japan-trip-store',
      partialize: (s) => ({
        checklist: s.checklist,
        iranDismissed: s.iranDismissed,
        currentDayBookmark: s.currentDayBookmark,
        bookingLinks: s.bookingLinks,
        bookingsWalletView: s.bookingsWalletView,
        daysViewMode: s.daysViewMode,
        selectedCalendarDay: s.selectedCalendarDay,
        dayCaptions: s.dayCaptions,
      }),
    }
  )
);

export function getChecklistProgress(): { completed: number; total: number } {
  const state = useStore.getState();
  const total = CHECKLIST_ITEMS_FLAT.length;
  const completed = Object.values(state.checklist).filter(Boolean).length;
  return { completed, total };
}
