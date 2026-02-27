'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PageTransition } from '@/components/ui/PageTransition';
import { MediaUploader } from '@/components/ui/MediaUploader';
import { Slideshow } from '@/components/ui/Slideshow';
import { getAllMedia, getMediaCounts } from '@/lib/mediaStorage';
import { findDayByNumber } from '@/lib/tripDays';
import { REGION_COLORS } from '@/lib/regions';
import { useStore } from '@/lib/store';

const TRIP_DAYS_COUNT = 39;

export default function MemoriesPage() {
  const router = useRouter();
  const { dayCaptions, setDayCaption } = useStore();
  const [mediaCountByDay, setMediaCountByDay] = useState<Record<number, number>>({});
  const [showAllDays, setShowAllDays] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const refreshCounts = useCallback(() => {
    getMediaCounts().then(setMediaCountByDay);
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const totalPhotos = Object.values(mediaCountByDay).reduce((a, b) => a + b, 0);
  const daysWithMedia = Object.keys(mediaCountByDay).filter((d) => mediaCountByDay[Number(d)] > 0).length;

  const allDays = Array.from({ length: TRIP_DAYS_COUNT }, (_, i) => i + 1);
  const daysToShow = showAllDays
    ? allDays
    : allDays.filter((d) => (mediaCountByDay[d] ?? 0) > 0);

  const handleDownload = async () => {
    const allMedia = await getAllMedia();
    if (allMedia.length === 0) {
      alert('No memories to download yet! Add some photos first.');
      return;
    }
    setDownloadProgress(0);
    const zip = new JSZip();
    const byDay = new Map<number, typeof allMedia>();
    for (const item of allMedia) {
      if (!byDay.has(item.dayNumber)) byDay.set(item.dayNumber, []);
      byDay.get(item.dayNumber)!.push(item);
    }
    const days = Array.from(byDay.keys()).sort((a, b) => a - b);
    let done = 0;
    for (const dayNum of days) {
      const day = findDayByNumber(dayNum);
      const safeName = day
        ? day.title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')
        : 'Unknown';
      const folderName = `Day_${String(dayNum).padStart(2, '0')}_${safeName}`;
      const folder = zip.folder(folderName)!;
      const items = byDay.get(dayNum)!;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const ext = item.type === 'image' ? 'jpg' : 'mp4';
        const base64 = item.dataUrl.split(',')[1];
        if (base64) folder.file(`${item.type}_${String(i + 1).padStart(2, '0')}.${ext}`, base64, { base64: true });
      }
      const caption = dayCaptions[dayNum];
      if (caption) {
        folder.file('caption.txt', `Day ${dayNum}: ${day?.title ?? ''}\n${day?.date ?? ''}\n\n${caption}`);
      }
      done++;
      setDownloadProgress(Math.round((done / days.length) * 100));
    }
    const blob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 1 } },
      (meta) => setDownloadProgress(Math.round(meta.percent))
    );
    saveAs(blob, 'Japan_Trip_Memories.zip');
    setDownloadProgress(null);
  };

  return (
    <PageTransition className="min-h-screen pb-8">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-divider px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-text-primary active:opacity-70"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg text-text-primary">Trip Memories</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary">🎬 Trip Memories</h2>
          <p className="text-sm text-text-secondary mt-1">
            {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} · {daysWithMedia} day{daysWithMedia !== 1 ? 's' : ''} with memories
          </p>
        </div>

        {/* Toggle: Show all days / Only with memories */}
        <div className="flex rounded-xl border border-divider bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setShowAllDays(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${showAllDays ? 'bg-white shadow text-text-primary' : 'text-text-secondary'}`}
          >
            All 39 days
          </button>
          <button
            type="button"
            onClick={() => setShowAllDays(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${!showAllDays ? 'bg-white shadow text-text-primary' : 'text-text-secondary'}`}
          >
            With memories
          </button>
        </div>

        {/* Day cards */}
        <div className="space-y-4">
          {daysToShow.map((dayNum) => {
            const day = findDayByNumber(dayNum);
            const count = mediaCountByDay[dayNum] ?? 0;
            const caption = dayCaptions[dayNum] ?? '';
            return (
              <div
                key={dayNum}
                className="rounded-2xl border border-divider bg-surface overflow-hidden"
                style={{ borderLeftWidth: 4, borderLeftColor: day ? REGION_COLORS[day.region] : '#ccc' }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-text-primary">
                      Day {dayNum} · {day?.title ?? '—'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">{day?.date ?? ''}</p>
                  <MediaUploader dayNumber={dayNum} onMediaAdded={refreshCounts} />
                  <textarea
                    placeholder="Add a caption (280 chars max)"
                    maxLength={280}
                    value={caption}
                    onChange={(e) => setDayCaption(dayNum, e.target.value)}
                    className="mt-3 w-full rounded-lg border border-divider bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary resize-none"
                    rows={2}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Download All */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadProgress !== null || totalPhotos === 0}
          className="w-full py-4 rounded-xl border-2 border-divider bg-surface font-semibold text-text-primary disabled:opacity-50"
        >
          {downloadProgress !== null
            ? `Preparing… ${downloadProgress}%`
            : '📥 Download All Memories'}
        </button>

        {/* Slideshow */}
        <button
          type="button"
          onClick={() => setShowSlideshow(true)}
          disabled={totalPhotos === 0}
          className="w-full py-4 rounded-xl border-2 border-divider bg-surface font-semibold text-text-primary disabled:opacity-50"
        >
          ▶️ Play Slideshow
        </button>

        <p className="text-xs text-text-secondary text-center">
          For a polished video, download your memories and use CapCut or iMovie 🎬
        </p>
      </div>

      {showSlideshow && <Slideshow onClose={() => setShowSlideshow(false)} />}
    </PageTransition>
  );
}
