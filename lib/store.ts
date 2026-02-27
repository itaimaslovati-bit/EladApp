import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKLIST_ITEMS_FLAT, TODO_ITEMS, PACKING_ITEMS_FLAT } from './data';
import type { TripSyncData } from './cloudSyncTypes';

function syncLater(
  importSync: () => Promise<{
    syncChecklist: (c: Record<number, boolean>) => Promise<void>;
    syncToBookChecked: (c: Record<number, boolean>) => Promise<void>;
    syncPackingChecked: (c: Record<number, boolean>) => Promise<void>;
    syncBookingLinks: (b: Record<string, string>) => Promise<void>;
    syncDayCaption: (d: number, caption: string) => Promise<void>;
    syncDayCaptions: (d: Record<number, string>) => Promise<void>;
  }>,
  run: (m: Awaited<ReturnType<typeof importSync>>) => Promise<unknown>
) {
  importSync().then(run).catch(() => {});
}

const USER_NAME_KEY = 'userName';

function numKeys<T>(r: Record<string, T>): Record<number, T> {
  const out: Record<number, T> = {};
  Object.entries(r || {}).forEach(([k, v]) => {
    const n = Number(k);
    if (!Number.isNaN(n)) out[n] = v;
  });
  return out;
}

interface AppState {
  checklist: Record<number, boolean>;
  toggleChecklist: (index: number) => void;
  resetChecklist: () => void;
  toBookChecked: Record<number, boolean>;
  toggleToBook: (index: number) => void;
  resetToBook: () => void;
  packingChecked: Record<number, boolean>;
  togglePacking: (index: number) => void;
  resetPacking: () => void;
  iranDismissed: boolean;
  setIranDismissed: () => void;
  currentDayBookmark: number | null;
  setCurrentDayBookmark: (day: number | null) => void;
  bookingLinks: Record<string, string>;
  setBookingLink: (reservationId: string, url: string) => void;
  bookingsWalletView: boolean;
  setBookingsWalletView: (value: boolean) => void;
  daysViewMode: 'calendar' | 'list';
  setDaysViewMode: (mode: 'calendar' | 'list') => void;
  selectedCalendarDay: number | null;
  setSelectedCalendarDay: (day: number | null) => void;
  dayCaptions: Record<number, string>;
  setDayCaption: (dayNumber: number, caption: string) => void;
  debugDayOverride: number | null;
  setDebugDayOverride: (day: number | null) => void;
  /** 'Tal' or 'Elad' — from localStorage, for photo attribution */
  userName: string | null;
  setUserName: (name: string) => void;
  /** Apply data from Firestore (called by cloud sync listener) */
  applyRemoteData: (data: TripSyncData) => void;
}

const defaultChecklist: Record<number, boolean> = {};
CHECKLIST_ITEMS_FLAT.forEach((_, i) => {
  defaultChecklist[i] = false;
});

const defaultToBook: Record<number, boolean> = {};
TODO_ITEMS.forEach((_, i) => {
  defaultToBook[i] = false;
});

const defaultPacking: Record<number, boolean> = {};
PACKING_ITEMS_FLAT.forEach((_, i) => {
  defaultPacking[i] = false;
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      checklist: defaultChecklist,
      toggleChecklist: (index) => {
        set((state) => ({
          checklist: {
            ...state.checklist,
            [index]: !state.checklist[index],
          },
        }));
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncChecklist(get().checklist));
      },
      resetChecklist: () => {
        set({ checklist: defaultChecklist });
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncChecklist(defaultChecklist));
      },
      toBookChecked: defaultToBook,
      toggleToBook: (index) => {
        set((state) => ({
          toBookChecked: {
            ...state.toBookChecked,
            [index]: !state.toBookChecked[index],
          },
        }));
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncToBookChecked(get().toBookChecked));
      },
      resetToBook: () => {
        set({ toBookChecked: defaultToBook });
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncToBookChecked(defaultToBook));
      },
      packingChecked: defaultPacking,
      togglePacking: (index) => {
        set((state) => {
          const current = state.packingChecked ?? defaultPacking;
          return {
            packingChecked: {
              ...current,
              [index]: !current[index],
            },
          };
        });
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncPackingChecked(get().packingChecked));
      },
      resetPacking: () => {
        set({ packingChecked: defaultPacking });
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncPackingChecked(defaultPacking));
      },
      iranDismissed: false,
      setIranDismissed: () => set({ iranDismissed: true }),
      currentDayBookmark: null,
      setCurrentDayBookmark: (day) => set({ currentDayBookmark: day }),
      bookingLinks: {},
      setBookingLink: (reservationId, url) => {
        set((state) => ({
          bookingLinks: url
            ? { ...state.bookingLinks, [reservationId]: url }
            : (() => {
                const next = { ...state.bookingLinks };
                delete next[reservationId];
                return next;
              })(),
        }));
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncBookingLinks(get().bookingLinks));
      },
      bookingsWalletView: false,
      setBookingsWalletView: (value) => set({ bookingsWalletView: value }),
      daysViewMode: 'list',
      setDaysViewMode: (mode) => set({ daysViewMode: mode }),
      selectedCalendarDay: null,
      setSelectedCalendarDay: (day) => set({ selectedCalendarDay: day }),
      dayCaptions: {},
      setDayCaption: (dayNumber, caption) => {
        const cap = caption.slice(0, 280);
        set((state) => ({
          dayCaptions: {
            ...state.dayCaptions,
            [dayNumber]: cap,
          },
        }));
        syncLater(() => import('@/lib/cloudSync'), (m) => m.syncDayCaption(dayNumber, cap));
      },
      debugDayOverride: null,
      setDebugDayOverride: (day) => set({ debugDayOverride: day }),
      userName: null,
      setUserName: (name: string) => {
        if (typeof window !== 'undefined')
          window.localStorage.setItem(USER_NAME_KEY, name);
        set({ userName: name });
      },
        applyRemoteData: (data: TripSyncData) => {
          try {
            set({
              checklist: { ...defaultChecklist, ...numKeys(data?.checklist ?? {}) },
              toBookChecked: { ...defaultToBook, ...numKeys(data?.toBookChecked ?? {}) },
              packingChecked: { ...defaultPacking, ...numKeys(data?.packingChecked ?? {}) },
              bookingLinks: data?.bookingLinks ?? {},
              dayCaptions: numKeys(data?.dayCaptions ?? {}),
            });
          } catch (e) {
            console.warn('[Store] applyRemoteData failed:', e);
          }
        },
    }),
    {
      name: 'japan-trip-store',
      partialize: (s) => ({
        checklist: s.checklist,
        toBookChecked: s.toBookChecked,
        packingChecked: s.packingChecked,
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

export function getToBookProgress(): { completed: number; total: number } {
  const state = useStore.getState();
  const total = TODO_ITEMS.length;
  const completed = Object.values(state.toBookChecked).filter(Boolean).length;
  return { completed, total };
}

export function getPackingProgress(): { completed: number; total: number } {
  const state = useStore.getState();
  const total = PACKING_ITEMS_FLAT.length;
  const checked = state.packingChecked ?? {};
  const completed = Object.values(checked).filter(Boolean).length;
  return { completed, total };
}
