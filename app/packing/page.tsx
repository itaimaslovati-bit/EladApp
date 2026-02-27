'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { useStore, getPackingProgress } from '@/lib/store';
import { PACKING_SECTIONS } from '@/lib/data';

function AddItemButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[44px] rounded-xl border-2 border-dashed border-[#E7E5E4] text-[#78716C] text-sm font-medium flex items-center justify-center gap-2 touch-manipulation active:bg-stone-50"
    >
      <span>+</span> Add item
    </button>
  );
}

function UserPackingRow({
  text,
  onDelete,
}: {
  text: string;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirming) {
      onDelete();
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };
  return (
    <div className="w-full flex items-center gap-2 p-4 rounded-xl bg-surface border border-divider border-l-4 border-l-accent min-h-[44px]">
      <span className="text-[13px] text-text-secondary mr-1" aria-hidden>✏️</span>
      <span className="flex-1 text-[15px] font-medium text-text-primary">{text}</span>
      {confirming ? (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-text-secondary">Delete?</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); setConfirming(false); }}
            className="text-xs font-medium text-red-600"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setConfirming(false); }}
            className="text-xs font-medium text-text-secondary"
          >
            No
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDelete}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 touch-manipulation"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default function PackingPage() {
  const router = useRouter();
  const {
    packingChecked = {},
    togglePacking,
    resetPacking,
    userPacking = [],
    addUserPacking,
    removeUserPacking,
  } = useStore();
  const { completed, total } = getPackingProgress();
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [newText, setNewText] = useState('');

  let index = 0;
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
        <h1 className="font-semibold text-lg text-text-primary">Packing</h1>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          {completed} of {total} completed
        </p>
        <button
          type="button"
          onClick={() => resetPacking()}
          className="text-xs font-medium text-accent active:opacity-70"
        >
          Reset All
        </button>
      </div>
      <div className="px-4 pt-4 space-y-6">
        {PACKING_SECTIONS.map((sec) => {
          const userItemsInSection = userPacking.filter((i) => i.category === sec.title);
          return (
            <section key={sec.title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                {sec.title}
              </h2>
              <div className="space-y-1.5">
                {sec.items.map((item) => {
                  const i = index++;
                  return (
                    <ChecklistItem
                      key={item.text}
                      text={item.text}
                      checked={packingChecked[i] ?? false}
                      onToggle={() => togglePacking(i)}
                    />
                  );
                })}
                {userItemsInSection.map((item) => (
                  <UserPackingRow
                    key={item.id}
                    text={item.text}
                    onDelete={() => removeUserPacking(item.id)}
                  />
                ))}
                <AddItemButton onClick={() => setAddingCategory(sec.title)} />
              </div>
              {addingCategory === sec.title && (
                <div className="mt-2 p-4 rounded-xl border border-divider bg-surface space-y-3">
                  <input
                    type="text"
                    placeholder="Item"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingCategory(null);
                        setNewText('');
                      }}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary active:opacity-70"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const t = newText.trim();
                        if (t) {
                          addUserPacking({ category: sec.title, text: t });
                          setNewText('');
                          setAddingCategory(null);
                        }
                      }}
                      disabled={!newText.trim()}
                      className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 active:scale-[0.98]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              {sec.note && (
                <p className="text-xs text-text-secondary italic mt-3 pt-2 border-t border-stone-100">
                  {sec.note}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </PageTransition>
  );
}
