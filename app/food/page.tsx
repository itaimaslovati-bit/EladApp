'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2, MapPin } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { FOOD_REGIONS } from '@/lib/data';
import { useStore } from '@/lib/store';

function AddDishButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[44px] rounded-xl border-2 border-dashed border-[#E7E5E4] text-[#78716C] text-sm font-medium flex items-center justify-center gap-2 touch-manipulation active:bg-stone-50"
    >
      <span>+</span> Add dish
    </button>
  );
}

function UserFoodRow({
  item,
  onDelete,
}: {
  item: { id: string; emoji: string; name: string; description: string; googleLink?: string };
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
      <span className="text-[13px] text-text-secondary shrink-0" aria-hidden>✏️</span>
      <span className="text-xl w-7 shrink-0 text-center">{item.emoji}</span>
      <div className="flex-1 min-w-0 border-l-2 border-l-accent pl-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-text-primary">{item.name}</span>
          <div className="flex items-center gap-1 shrink-0">
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
        <p className="text-sm text-text-secondary mt-0.5">{item.description}</p>
        {item.googleLink && (
          <a
            href={item.googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1 text-xs text-accent font-medium"
          >
            <MapPin size={12} />
            Map
          </a>
        )}
      </div>
    </div>
  );
}

export default function FoodPage() {
  const router = useRouter();
  const { userFood = [], addUserFood, removeUserFood } = useStore();
  const [addingRegion, setAddingRegion] = useState<string | null>(null);
  const [emoji, setEmoji] = useState('🍽️');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [googleLink, setGoogleLink] = useState('');

  const resetForm = () => {
    setAddingRegion(null);
    setEmoji('🍽️');
    setName('');
    setDescription('');
    setGoogleLink('');
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
        <h1 className="font-semibold text-lg text-text-primary">Food Guide</h1>
      </div>
      <div className="px-4 pt-6 space-y-4">
        {FOOD_REGIONS.map((region) => {
          const userInRegion = userFood.filter((i) => i.region === region.title);
          return (
            <div key={region.title} className="rounded-xl border border-divider bg-surface p-4">
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">{region.title}</h2>
              <div className="space-y-3">
                {region.items.map((item) => (
                  <div key={item.name} className="flex gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                    <span className="text-xl w-7 shrink-0 text-center">{item.emoji}</span>
                    <div>
                      <span className="font-semibold text-text-primary">{item.name}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
                {userInRegion.map((item) => (
                  <UserFoodRow
                    key={item.id}
                    item={item}
                    onDelete={() => removeUserFood(item.id)}
                  />
                ))}
                <AddDishButton onClick={() => setAddingRegion(region.title)} />
              </div>
              {addingRegion === region.title && (
                <div className="mt-3 p-4 rounded-xl border border-divider bg-background space-y-3">
                  <div className="flex gap-2 items-center">
                    <label className="text-xs text-text-secondary shrink-0">Emoji</label>
                    <input
                      type="text"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value.slice(0, 2) || '🍽️')}
                      className="w-14 rounded-lg border border-divider bg-surface px-2 py-2.5 text-center text-lg"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-divider bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-divider bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder="Google Maps link (optional)"
                      value={googleLink}
                      onChange={(e) => setGoogleLink(e.target.value)}
                      className="flex-1 min-w-0 rounded-lg border border-divider bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                    />
                    <span className="text-lg shrink-0" aria-hidden>🔗</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary active:opacity-70">Cancel</button>
                    <button
                      type="button"
                      onClick={() => {
                        const n = name.trim();
                        if (n) {
                          addUserFood({
                            region: region.title,
                            name: n,
                            description: description.trim(),
                            emoji: emoji || '🍽️',
                            googleLink: googleLink.trim() || undefined,
                          });
                          resetForm();
                        }
                      }}
                      disabled={!name.trim()}
                      className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 active:scale-[0.98]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
