import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

const TRIP_ID = 'japan-2025';

function getMediaCollection() {
  if (!db) return null;
  return collection(db, 'trips', TRIP_ID, 'media');
}

export interface CloudMediaItem {
  id: string;
  dayNumber: number;
  type: 'image';
  fileName: string;
  imageData: string;
  thumbnail: string;
  timestamp: number;
  uploadedBy: string;
}

function compressForCloud(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      if (img.width <= MAX_WIDTH) {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = Math.round(img.height * scale);
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function createThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 150;
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.5));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadPhoto(
  dayNumber: number,
  file: File,
  uploadedBy: string
): Promise<CloudMediaItem> {
  const rawDataUrl = await readFileAsDataUrl(file);
  const imageData = await compressForCloud(rawDataUrl);
  // Use compressed JPEG for thumbnail if raw (e.g. HEIC on iOS) fails to decode in Image
  const thumbnail = await createThumbnail(rawDataUrl).catch(() =>
    createThumbnail(imageData)
  );
  const docData = {
    dayNumber,
    type: 'image' as const,
    fileName: file.name,
    imageData,
    thumbnail,
    timestamp: Date.now(),
    uploadedBy,
  };
  const coll = getMediaCollection();
  if (!coll) throw new Error('Firebase not configured');
  const docRef = await addDoc(coll, docData);
  return { id: docRef.id, ...docData };
}

export function subscribeToMediaForDay(
  dayNumber: number,
  callback: (media: CloudMediaItem[]) => void
): Unsubscribe {
  const coll = getMediaCollection();
  if (!coll) {
    callback([]);
    return () => {};
  }
  const q = query(
    coll,
    where('dayNumber', '==', dayNumber),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CloudMediaItem))
    );
  });
}

export function subscribeToAllMedia(
  callback: (media: CloudMediaItem[]) => void
): Unsubscribe {
  const coll = getMediaCollection();
  if (!coll) {
    callback([]);
    return () => {};
  }
  const q = query(
    coll,
    orderBy('dayNumber', 'asc'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CloudMediaItem))
    );
  });
}

export function subscribeToMediaCounts(
  callback: (counts: Record<number, number>) => void
): Unsubscribe {
  const coll = getMediaCollection();
  if (!coll) {
    callback({});
    return () => {};
  }
  return onSnapshot(coll, (snapshot) => {
    const counts: Record<number, number> = {};
    snapshot.docs.forEach((d) => {
      const dayNum = d.data().dayNumber as number;
      counts[dayNum] = (counts[dayNum] || 0) + 1;
    });
    callback(counts);
  });
}

export async function deleteCloudMedia(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'trips', TRIP_ID, 'media', id));
}
