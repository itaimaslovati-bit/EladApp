import { get, del, keys } from 'idb-keyval';
import type { MediaItem } from './mediaStorage';
import { uploadPhoto } from './cloudMediaStorage';

const MIGRATED_KEY = 'japan-trip-media-migrated';

export async function hasMigrated(): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(MIGRATED_KEY) === '1';
}

function dataUrlToFile(dataUrl: string, fileName: string): File {
  const [header, base64] = dataUrl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64 || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], fileName, { type: mime });
}

/** One-time migration: upload IndexedDB images to Firestore, then remove from IndexedDB. */
export async function migrateMediaToCloud(uploadedBy: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(MIGRATED_KEY) === '1') return;

  const allKeys = await keys();
  const dayKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith('day-')
  );

  for (const key of dayKeys) {
    const item = await get(key);
    if (!item || (item as MediaItem).type !== 'image') continue;
    const media = item as MediaItem;
    try {
      const file = dataUrlToFile(media.dataUrl, media.fileName || 'photo.jpg');
      await uploadPhoto(media.dayNumber, file, uploadedBy);
      await del(key);
    } catch {
      // Skip failed item, continue with rest
    }
  }

  localStorage.setItem(MIGRATED_KEY, '1');
}
