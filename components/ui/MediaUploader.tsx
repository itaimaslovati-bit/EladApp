'use client';

import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import {
  getMediaForDay,
  saveMedia,
  deleteMedia,
  readFileAsDataUrl,
  generateVideoThumbnail,
  type MediaItem,
} from '@/lib/mediaStorage';
import {
  uploadPhoto,
  subscribeToMediaForDay,
  deleteCloudMedia,
  type CloudMediaItem,
} from '@/lib/cloudMediaStorage';
import { useStore } from '@/lib/store';
import { Lightbox } from '@/components/ui/Lightbox';
import type { DisplayMediaItem } from '@/lib/mediaTypes';

interface MediaUploaderProps {
  dayNumber: number;
  onMediaAdded: () => void;
}

function toDisplayItems(
  cloud: CloudMediaItem[],
  localVideos: MediaItem[]
): DisplayMediaItem[] {
  const list: DisplayMediaItem[] = [
    ...cloud.map((c) => ({
      type: 'image' as const,
      id: c.id,
      thumbnail: c.thumbnail || c.imageData,
      fullUrl: c.imageData,
      timestamp: c.timestamp,
      uploadedBy: c.uploadedBy,
      source: 'cloud' as const,
    })),
    ...localVideos.map((v) => ({
      type: 'video' as const,
      id: v.id,
      thumbnail: v.thumbnail,
      fullUrl: v.dataUrl,
      timestamp: v.timestamp,
      source: 'local' as const,
    })),
  ];
  list.sort((a, b) => a.timestamp - b.timestamp);
  return list;
}

export function MediaUploader({ dayNumber, onMediaAdded }: MediaUploaderProps) {
  const userName = useStore((s) => s.userName) ?? 'Unknown';
  const [cloudImages, setCloudImages] = useState<CloudMediaItem[]>([]);
  const [localVideos, setLocalVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<DisplayMediaItem | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return subscribeToMediaForDay(dayNumber, setCloudImages);
  }, [dayNumber]);

  const loadLocalVideos = () => {
    getMediaForDay(dayNumber).then((all) =>
      setLocalVideos(all.filter((m) => m.type === 'video'))
    );
  };

  useEffect(() => {
    loadLocalVideos();
  }, [dayNumber]);

  const items = toDisplayItems(cloudImages, localVideos);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const videoFiles = Array.from(files).filter((f) => f.type.startsWith('video/'));
    setLoading(true);
    try {
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadProgress(`Uploading ${i + 1} of ${imageFiles.length}…`);
          await uploadPhoto(dayNumber, imageFiles[i], userName);
        }
        setUploadProgress(null);
      }
      if (videoFiles.length > 0) {
        for (let i = 0; i < videoFiles.length; i++) {
          const file = videoFiles[i];
          const dataUrl = await readFileAsDataUrl(file);
          const thumbnail = await generateVideoThumbnail(dataUrl);
          const id = `day-${dayNumber}-${Date.now()}-v-${i}`;
          const item: MediaItem = {
            id,
            dayNumber,
            type: 'video',
            dataUrl,
            thumbnail,
            timestamp: Date.now(),
            fileName: file.name,
          };
          await saveMedia(item);
        }
        loadLocalVideos();
      }
      onMediaAdded();
    } finally {
      setLoading(false);
      setUploadProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (item: DisplayMediaItem) => {
    const confirmed = typeof window !== 'undefined' && window.confirm('Delete this photo?');
    if (!confirmed) return;
    try {
      if (item.source === 'cloud') {
        await deleteCloudMedia(item.id);
      } else {
        await deleteMedia(item.id);
        loadLocalVideos();
      }
      setLightboxItem(null);
      onMediaAdded();
    } catch (error) {
      console.error('Failed to delete:', error);
      if (typeof window !== 'undefined') window.alert('Failed to delete. Check console for details.');
    }
  };

  const currentIndex = lightboxItem ? items.findIndex((i) => i.id === lightboxItem.id) : -1;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : undefined;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-[10px] overflow-hidden bg-stone-100 border border-divider">
            <button
              type="button"
              onClick={() => setLightboxItem(item)}
              className="absolute inset-0 w-full h-full"
            >
              {item.type === 'image' ? (
                failedImageIds.has(item.id) ? (
                  <span className="w-full h-full flex items-center justify-center text-text-secondary text-xs bg-stone-200">Photo</span>
                ) : (
                  <img
                    src={item.thumbnail || item.fullUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src !== item.fullUrl) {
                        el.src = item.fullUrl;
                      } else {
                        setFailedImageIds((prev) => new Set(prev).add(item.id));
                      }
                    }}
                  />
                )
              ) : failedImageIds.has(item.id) ? (
                <span className="w-full h-full flex items-center justify-center text-text-secondary text-xs bg-stone-200">Video</span>
              ) : (
                <>
                  <img
                    src={item.thumbnail || item.fullUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src !== item.fullUrl) {
                        el.src = item.fullUrl;
                      } else {
                        setFailedImageIds((prev) => new Set(prev).add(item.id));
                      }
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play size={32} className="text-white drop-shadow" fill="white" />
                  </span>
                </>
              )}
            </button>
            {/* Delete button — visible on each thumbnail */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80 active:scale-95 touch-manipulation z-10"
              aria-label="Delete"
            >
              ✕
            </button>
            {/* Uploader initial (cloud) or device-only badge (local video) */}
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs font-bold flex items-center justify-center pointer-events-none">
              {item.source === 'cloud' && item.uploadedBy
                ? item.uploadedBy[0].toUpperCase()
                : '📱'}
            </span>
          </div>
        ))}
        <label className="aspect-square rounded-[10px] border-2 border-dashed border-divider flex items-center justify-center cursor-pointer active:bg-stone-50 min-h-[80px]">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          {loading ? (
            <span className="text-text-secondary text-sm text-center px-1">
              {uploadProgress ?? 'Uploading…'}
            </span>
          ) : (
            <span className="text-accent font-medium text-sm">Add +</span>
          )}
        </label>
      </div>

      {lightboxItem && (
        <Lightbox
          media={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onDelete={() => handleDelete(lightboxItem)}
          onPrev={prevItem ? () => setLightboxItem(prevItem) : undefined}
          onNext={nextItem ? () => setLightboxItem(nextItem) : undefined}
        />
      )}
    </div>
  );
}
