import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKLIST_ITEMS_FLAT, TODO_ITEMS, PACKING_ITEMS_FLAT, COST_SUMMARY } from './data';
import type {
  TripSyncData,
  CostSummaryRow,
  UserPackingItem,
  UserFoodItem,
  UserToBookItem,
  UserIdeaItem,
  UserPhraseItem,
} from './cloudSyncTypes';

function syncLater(
  importSync: () => Promise<{
    syncChecklist: (c: Record<number, boolean>) => Promise<void>;
    syncToBookChecked: (c: Record<number, boolean>) => Promise<void>;
    syncPackingChecked: (c: Record<number, boolean>) => Promise<void>;
    syncBookingLinks: (b: Record<string, string>) => Promise<void>;
    syncCostSummary: (c: CostSummaryRow[]) => Promise<void>;
    syncDayCaption: (d: number, caption: string) => Promise<void>;
    syncDayCaptions: (d: Record<number, string>) => Promise<void>;
    syncUserPacking: (items: UserPackingItem[]) => Promise<void>;
    syncUserFood: (items: UserFoodItem[]) => Promise<void>;
    syncUserToBook: (items: UserToBookItem[]) => Promise<void>;
    syncUserIdeas: (items: UserIdeaItem[]) => Promise<void>;
    syncUserPhrases: (items: UserPhraseItem[]) => Promise<void>;
  }>,
  run: (m: Awaited<ReturnType<typeof importSync>>) => Promise<unknown>,
  options?: { logErrors?: boolean }
) {
  importSync()
    .then(run)
    .catch((e) => {
      if (options?.logErrors) console.error('[Store] sync failed:', e);
    });
}

const USER_NAME_KEY = 'userName';

const BOOKING_LINKS_LOCAL_KEY = 'bookingLinksLocal';

/** Once user has set/removed a link this session, never overwrite bookingLinks from Firestore (so delete sticks). */
function shouldPreferLocalBookingLinks(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(BOOKING_LINKS_LOCAL_KEY) === 'true';
}

function markBookingLinksTouched(): void {
  if (typeof window !== 'undefined') sessionStorage.setItem(BOOKING_LINKS_LOCAL_KEY, 'true');
}

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
  costSummary: CostSummaryRow[];
  setCostSummaryRow: (index: number, amount: string) => void;
  userPacking: UserPackingItem[];
  addUserPacking: (item: Omit<UserPackingItem, 'id'>) => void;
  removeUserPacking: (id: string) => void;
  userFood: UserFoodItem[];
  addUserFood: (item: Omit<UserFoodItem, 'id'>) => void;
  removeUserFood: (id: string) => void;
  userToBook: UserToBookItem[];
  addUserToBook: (item: Omit<UserToBookItem, 'id'>) => void;
  removeUserToBook: (id: string) => void;
  userIdeas: UserIdeaItem[];
  addUserIdea: (item: Omit<UserIdeaItem, 'id'>) => void;
  removeUserIdea: (id: string) => void;
  userPhrases: UserPhraseItem[];
  addUserPhrase: (item: Omit<UserPhraseItem, 'id'>) => void;
  removeUserPhrase: (id: string) => void;
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
        markBookingLinksTouched();
        set((state) => {
          const next = url
            ? { ...state.bookingLinks, [reservationId]: url }
            : (() => {
                const n = { ...state.bookingLinks };
                delete n[reservationId];
                return n;
              })();
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncBookingLinks(next), { logErrors: true });
          return { bookingLinks: next };
        });
      },
      costSummary: COST_SUMMARY,
      setCostSummaryRow: (index, amount) => {
        set((state) => {
          const next = state.costSummary.map((row, i) =>
            i === index ? { ...row, amount: amount.trim() || row.amount } : row
          );
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncCostSummary(next));
          return { costSummary: next };
        });
      },
      userPacking: [],
      addUserPacking: (item) => {
        const newItem: UserPackingItem = { ...item, id: `p-${Date.now()}` };
        set((state) => {
          const next = [...(state.userPacking ?? []), newItem];
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserPacking(next));
          return { userPacking: next };
        });
      },
      removeUserPacking: (id) => {
        set((state) => {
          const next = (state.userPacking ?? []).filter((i) => i.id !== id);
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserPacking(next));
          return { userPacking: next };
        });
      },
      userFood: [],
      addUserFood: (item) => {
        const newItem: UserFoodItem = { ...item, id: `f-${Date.now()}` };
        set((state) => {
          const next = [...(state.userFood ?? []), newItem];
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserFood(next));
          return { userFood: next };
        });
      },
      removeUserFood: (id) => {
        set((state) => {
          const next = (state.userFood ?? []).filter((i) => i.id !== id);
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserFood(next));
          return { userFood: next };
        });
      },
      userToBook: [],
      addUserToBook: (item) => {
        const newItem: UserToBookItem = { ...item, id: `t-${Date.now()}` };
        set((state) => {
          const next = [...(state.userToBook ?? []), newItem];
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserToBook(next));
          return { userToBook: next };
        });
      },
      removeUserToBook: (id) => {
        set((state) => {
          const next = (state.userToBook ?? []).filter((i) => i.id !== id);
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserToBook(next));
          return { userToBook: next };
        });
      },
      userIdeas: [],
      addUserIdea: (item) => {
        const newItem: UserIdeaItem = { ...item, id: `i-${Date.now()}` };
        set((state) => {
          const next = [...(state.userIdeas ?? []), newItem];
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserIdeas(next));
          return { userIdeas: next };
        });
      },
      removeUserIdea: (id) => {
        set((state) => {
          const next = (state.userIdeas ?? []).filter((i) => i.id !== id);
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserIdeas(next));
          return { userIdeas: next };
        });
      },
      userPhrases: [],
      addUserPhrase: (item) => {
        const newItem: UserPhraseItem = { ...item, id: `ph-${Date.now()}` };
        set((state) => {
          const next = [...(state.userPhrases ?? []), newItem];
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserPhrases(next));
          return { userPhrases: next };
        });
      },
      removeUserPhrase: (id) => {
        set((state) => {
          const next = (state.userPhrases ?? []).filter((i) => i.id !== id);
          syncLater(() => import('@/lib/cloudSync'), (m) => m.syncUserPhrases(next));
          return { userPhrases: next };
        });
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
            const preferLocal = shouldPreferLocalBookingLinks();
            if (!preferLocal && typeof window !== 'undefined')
              sessionStorage.setItem(BOOKING_LINKS_LOCAL_KEY, 'true'); // so next snapshot we prefer local
            const bookingLinks =
              preferLocal
                ? (useStore.getState().bookingLinks ?? {})
                : (data?.bookingLinks ?? {});
            const costSummary =
              (data?.costSummary?.length ?? 0) > 0
                ? data.costSummary
                : (useStore.getState().costSummary ?? COST_SUMMARY);
            set({
              checklist: { ...defaultChecklist, ...numKeys(data?.checklist ?? {}) },
              toBookChecked: { ...defaultToBook, ...numKeys(data?.toBookChecked ?? {}) },
              packingChecked: { ...defaultPacking, ...numKeys(data?.packingChecked ?? {}) },
              bookingLinks,
              dayCaptions: numKeys(data?.dayCaptions ?? {}),
              costSummary,
              userPacking: data?.userPacking ?? [],
              userFood: data?.userFood ?? [],
              userToBook: data?.userToBook ?? [],
              userIdeas: data?.userIdeas ?? [],
              userPhrases: data?.userPhrases ?? [],
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
        costSummary: s.costSummary,
        userPacking: s.userPacking,
        userFood: s.userFood,
        userToBook: s.userToBook,
        userIdeas: s.userIdeas,
        userPhrases: s.userPhrases,
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
