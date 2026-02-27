'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PHRASE_CATEGORIES } from '@/lib/data';
import { useStore } from '@/lib/store';

function AddPhraseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[44px] rounded-xl border-2 border-dashed border-[#E7E5E4] text-[#78716C] text-sm font-medium flex items-center justify-center gap-2 touch-manipulation active:bg-stone-50"
    >
      <span>+</span> Add phrase
    </button>
  );
}

function UserPhraseRow({
  item,
  onDelete,
  onCopy,
}: {
  item: { id: string; english: string; japanese: string };
  onDelete: () => void;
  onCopy: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex items-center gap-2 py-2 border-b border-stone-100 last:border-0 border-l-2 border-l-accent pl-2">
      <span className="text-[13px] text-text-secondary shrink-0" aria-hidden>✏️</span>
      <span className="flex-1 min-w-0 text-sm text-text-secondary">{item.english}</span>
      <button
        type="button"
        onClick={onCopy}
        className="text-sm font-semibold text-right font-[inherit] hover:bg-stone-100 rounded px-2 py-1 shrink-0"
      >
        {item.japanese}
      </button>
      {confirming ? (
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-text-secondary">Delete?</span>
          <button type="button" onClick={() => { onDelete(); setConfirming(false); }} className="text-xs font-medium text-red-600">Yes</button>
          <button type="button" onClick={() => setConfirming(false)} className="text-xs font-medium text-text-secondary">No</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 touch-manipulation shrink-0"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default function PhrasesPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const { userPhrases = [], addUserPhrase, removeUserPhrase } = useStore();
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [english, setEnglish] = useState('');
  const [japanese, setJapanese] = useState('');

  const copyJapanese = (jp: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jp);
      setToast('Copied!');
      setTimeout(() => setToast(null), 1500);
    }
  };

  const resetForm = () => {
    setAddingCategory(null);
    setEnglish('');
    setJapanese('');
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
        <h1 className="font-semibold text-lg text-text-primary">Phrases</h1>
      </div>
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-4 py-2 rounded-full z-50 shadow-lg">
          {toast}
        </div>
      )}
      <div className="px-4 pt-6 space-y-4">
        {PHRASE_CATEGORIES.map((cat) => {
          const userInCat = userPhrases.filter((i) => i.category === cat.title);
          return (
            <div key={cat.title} className="rounded-xl border border-divider bg-surface p-4">
              <h2 className="text-base font-bold text-text-primary mb-3">{cat.title}</h2>
              <div className="space-y-2">
                {cat.phrases.map((p) => (
                  <div
                    key={p.en}
                    className="grid grid-cols-2 gap-2 py-2 border-b border-stone-100 last:border-0 items-center"
                  >
                    <span className="text-sm text-text-secondary">{p.en}</span>
                    <button
                      type="button"
                      onClick={() => copyJapanese(p.jp)}
                      className="text-sm font-semibold text-right font-[inherit] hover:bg-stone-100 rounded px-2 py-1 -mr-2 transition-colors"
                    >
                      {p.jp}
                    </button>
                  </div>
                ))}
                {userInCat.map((item) => (
                  <UserPhraseRow
                    key={item.id}
                    item={item}
                    onDelete={() => removeUserPhrase(item.id)}
                    onCopy={() => copyJapanese(item.japanese)}
                  />
                ))}
                <AddPhraseButton onClick={() => setAddingCategory(cat.title)} />
              </div>
              {addingCategory === cat.title && (
                <div className="mt-3 p-4 rounded-xl border border-divider bg-background space-y-3">
                  <input
                    type="text"
                    placeholder="English"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    className="w-full rounded-lg border border-divider bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                  />
                  <input
                    type="text"
                    placeholder="Japanese"
                    value={japanese}
                    onChange={(e) => setJapanese(e.target.value)}
                    className="w-full rounded-lg border border-divider bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary active:opacity-70">Cancel</button>
                    <button
                      type="button"
                      onClick={() => {
                        const en = english.trim();
                        const jp = japanese.trim();
                        if (en && jp) {
                          addUserPhrase({ category: cat.title, english: en, japanese: jp });
                          resetForm();
                        }
                      }}
                      disabled={!english.trim() || !japanese.trim()}
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
