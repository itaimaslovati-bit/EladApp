import { doc, onSnapshot, setDoc, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import type { TripSyncData } from './cloudSyncTypes';

export type { TripSyncData } from './cloudSyncTypes';

const TRIP_ID = 'japan-2025';

function getTripDocRef() {
  if (!db) return null;
  return doc(db, 'trips', TRIP_ID);
}

const defaultSyncData: TripSyncData = {
  checklist: {},
  toBookChecked: {},
  packingChecked: {},
  bookingLinks: {},
  dayCaptions: {},
};

export function subscribeToTripData(
  callback: (data: TripSyncData) => void
): Unsubscribe {
  const ref = getTripDocRef();
  if (!ref) {
    callback(defaultSyncData);
    return () => {};
  }
  return onSnapshot(ref, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as TripSyncData;
      callback({
        checklist: data.checklist ?? {},
        toBookChecked: data.toBookChecked ?? {},
        packingChecked: data.packingChecked ?? {},
        bookingLinks: data.bookingLinks ?? {},
        dayCaptions: data.dayCaptions ?? {},
      });
    } else {
      setDoc(ref, defaultSyncData);
      callback(defaultSyncData);
    }
  });
}

/** Convert number-keyed record to string keys for Firestore */
function stringKeys<T>(r: Record<number, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [String(k), v]));
}

export async function syncChecklist(checklist: Record<number, boolean>) {
  const ref = getTripDocRef();
  if (!ref) return;
  await setDoc(ref, { checklist: stringKeys(checklist) }, { merge: true });
}

export async function syncToBookChecked(toBookChecked: Record<number, boolean>) {
  const ref = getTripDocRef();
  if (!ref) return;
  await setDoc(ref, { toBookChecked: stringKeys(toBookChecked) }, { merge: true });
}

export async function syncPackingChecked(packingChecked: Record<number, boolean>) {
  const ref = getTripDocRef();
  if (!ref) return;
  await setDoc(ref, { packingChecked: stringKeys(packingChecked) }, { merge: true });
}

export async function syncBookingLinks(bookingLinks: Record<string, string>) {
  const ref = getTripDocRef();
  if (!ref) return;
  await setDoc(ref, { bookingLinks }, { merge: true });
}

/** dayCaptions keyed by day number */
export async function syncDayCaptions(dayCaptions: Record<number, string>) {
  const ref = getTripDocRef();
  if (!ref) return;
  const asStrings = Object.fromEntries(
    Object.entries(dayCaptions).map(([k, v]) => [String(k), v])
  );
  await setDoc(ref, { dayCaptions: asStrings }, { merge: true });
}

export async function syncDayCaption(dayNumber: number, caption: string) {
  const ref = getTripDocRef();
  if (!ref) return;
  await updateDoc(ref, {
    [`dayCaptions.${dayNumber}`]: caption,
  });
}
