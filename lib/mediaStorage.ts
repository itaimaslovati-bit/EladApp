import { get, set, del, keys } from 'idb-keyval';

export interface MediaItem {
  id: string;
  dayNumber: number;
  type: 'image' | 'video';
  dataUrl: string;
  thumbnail: string;
  timestamp: number;
  fileName: string;
}

export async function saveMedia(item: MediaItem): Promise<void> {
  await set(item.id, item);
}

export async function getMediaForDay(dayNumber: number): Promise<MediaItem[]> {
  const allKeys = await keys();
  const dayKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith(`day-${dayNumber}-`)
  );
  const items = await Promise.all(dayKeys.map((k) => get(k) as Promise<MediaItem | undefined>));
  return (items.filter(Boolean) as MediaItem[]).sort((a, b) => a.timestamp - b.timestamp);
}

export async function getMediaCounts(): Promise<Record<number, number>> {
  const allKeys = await keys();
  const counts: Record<number, number> = {};
  for (const k of allKeys) {
    const str = String(k);
    const match = str.match(/^day-(\d+)-/);
    if (match) {
      const dayNum = parseInt(match[1], 10);
      counts[dayNum] = (counts[dayNum] || 0) + 1;
    }
  }
  return counts;
}

export async function deleteMedia(id: string): Promise<void> {
  await del(id);
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const allKeys = await keys();
  const mediaKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith('day-')
  );
  const items = await Promise.all(mediaKeys.map((k) => get(k) as Promise<MediaItem | undefined>));
  return (items.filter(Boolean) as MediaItem[]).sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return a.timestamp - b.timestamp;
  });
}

export function generateThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 200;
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = Math.round(img.height * scale);
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

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function compressImage(
  dataUrl: string,
  maxWidth = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxWidth) {
        resolve(dataUrl);
        return;
      }
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function generateVideoThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      video.currentTime = 0.5;
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 200;
      const scale = maxWidth / video.videoWidth;
      canvas.width = maxWidth;
      canvas.height = Math.round(video.videoHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (video.src) URL.revokeObjectURL(video.src);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    video.onerror = reject;
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        video.src = URL.createObjectURL(blob);
      })
      .catch(reject);
  });
}
