'use client';

import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import {
  getMediaForDay,
  saveMedia,
  deleteMedia,
  readFileAsDataUrl,
  generateThumbnail,
  generateVideoThumbnail,
  compressImage,
  type MediaItem,
} from '@/lib/mediaStorage';
import { Lightbox } from '@/components/ui/Lightbox';

interface MediaUploaderProps {
  dayNumber: number;
  onMediaAdded: () => void;
}

export function MediaUploader({ dayNumber, onMediaAdded }: MediaUploaderProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    getMediaForDay(dayNumber).then(setItems);
  };

  useEffect(() => {
    load();
  }, [dayNumber]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const dataUrl = await readFileAsDataUrl(file);
        const thumbnail = isVideo
          ? await generateVideoThumbnail(dataUrl)
          : await generateThumbnail(dataUrl);
        const compressedDataUrl = isVideo ? dataUrl : await compressImage(dataUrl, 1200, 0.8);
        const id = `day-${dayNumber}-${Date.now()}-${i}`;
        const item: MediaItem = {
          id,
          dayNumber,
          type: isVideo ? 'video' : 'image',
          dataUrl: compressedDataUrl,
          thumbnail,
          timestamp: Date.now(),
          fileName: file.name,
        };
        await saveMedia(item);
      }
      load();
      onMediaAdded();
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMedia(id);
    setLightboxItem(null);
    load();
    onMediaAdded();
  };

  const currentIndex = lightboxItem ? items.findIndex((i) => i.id === lightboxItem.id) : -1;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : undefined;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxItem(item)}
            className="relative aspect-square rounded-[10px] overflow-hidden bg-stone-100 border border-divider"
          >
            {item.type === 'image' ? (
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={32} className="text-white drop-shadow" fill="white" />
                </span>
              </>
            )}
          </button>
        ))}
        <label className="aspect-square rounded-[10px] border-2 border-dashed border-divider flex items-center justify-center cursor-pointer active:bg-stone-50 min-h-[80px]">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            multiple
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          {loading ? (
            <span className="text-text-secondary text-sm">Uploading…</span>
          ) : (
            <span className="text-accent font-medium text-sm">Add +</span>
          )}
        </label>
      </div>

      {lightboxItem && (
        <Lightbox
          media={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onDelete={() => handleDelete(lightboxItem.id)}
          onPrev={prevItem ? () => setLightboxItem(prevItem) : undefined}
          onNext={nextItem ? () => setLightboxItem(nextItem) : undefined}
        />
      )}
    </div>
  );
}
