'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { IDEA_ITEMS } from '@/lib/data';
import { useStore } from '@/lib/store';

const REGION_OPTIONS = ['Tokyo', 'Kyoto', 'Osaka', 'Rural', 'Kyushu', 'Okinawa', 'Aso'] as const;

const regionColors: Record<string, string> = {
  Tokyo: '#DC2626',
  Kyoto: '#7C3AED',
  Osaka: '#EA580C',
  Rural: '#059669',
  Kyushu: '#CA8A04',
  Okinawa: '#0891B2',
  Aso: '#E11D48',
};

function AddIdeaButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[44px] rounded-xl border-2 border-dashed border-[#E7E5E4] text-[#78716C] text-sm font-medium flex items-center justify-center gap-2 touch-manipulation active:bg-stone-50"
    >
      <span>+</span> Add idea
    </button>
  );
}

function UserIdeaRow({
  item,
  onDelete,
}: {
  item: { id: string; region: string; title: string; description: string; fit: string };
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const color = regionColors[item.region] ?? '#78716C';
  return (
    <div className="rounded-xl border border-divider border-l-4 bg-surface p-4" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{item.region}</span>
        <div className="flex items-center gap-1">
          {confirming ? (
            <>
              <span className="text-xs text-text-secondary">Delete?</span>
              <button type="button" onClick={() => { onDelete(); setConfirming(false); }} className="text-xs font-medium text-red-600">Yes</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs font-medium text-text-secondary">No</button>
            </>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 touch-manipulation"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <span className="text-[13px] text-text-secondary mr-1" aria-hidden>✏️</span>
      <h2 className="text-base font-bold text-text-primary mt-1">{item.title}</h2>
      <p className="text-sm text-text-secondary mt-1 leading-relaxed">{item.description}</p>
      <span
        className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-md"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {item.fit}
      </span>
    </div>
  );
}

export default function IdeasPage() {
  const router = useRouter();
  const { userIdeas = [], addUserIdea, removeUserIdea } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>(REGION_OPTIONS[0]);
  const [fit, setFit] = useState('');

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setRegion(REGION_OPTIONS[0]);
    setFit('');
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
        <h1 className="font-semibold text-lg text-text-primary">Ideas</h1>
      </div>
      <p className="px-4 pt-4 text-sm text-text-secondary border-b border-divider pb-4">
        Based on your route, these are the top things you might be missing. Only the highlights.
      </p>
      <div className="px-4 pt-6 space-y-4">
        {IDEA_ITEMS.map((idea) => (
          <div
            key={idea.title}
            className="rounded-xl border border-divider bg-surface p-4"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: idea.regionColor }}
            >
              {idea.region}
            </span>
            <h2 className="text-base font-bold text-text-primary mt-1">{idea.title}</h2>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">{idea.description}</p>
            <span
              className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-md"
              style={{
                backgroundColor: `${idea.regionColor}20`,
                color: idea.regionColor,
              }}
            >
              {idea.fit}
            </span>
          </div>
        ))}
        <h2 className="text-sm font-bold text-text-primary pt-2">✏️ Your ideas</h2>
        {userIdeas.map((item) => (
          <UserIdeaRow key={item.id} item={item} onDelete={() => removeUserIdea(item.id)} />
        ))}
        <AddIdeaButton onClick={() => setShowForm(true)} />
        {showForm && (
          <div className="p-4 rounded-xl border border-divider bg-surface space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
            />
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary min-h-[44px]"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Best fit (e.g. Day 5 morning)"
              value={fit}
              onChange={(e) => setFit(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary active:opacity-70">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  const t = title.trim();
                  if (t) {
                    addUserIdea({ title: t, description: description.trim(), region, fit: fit.trim() || '—' });
                    resetForm();
                  }
                }}
                disabled={!title.trim()}
                className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
