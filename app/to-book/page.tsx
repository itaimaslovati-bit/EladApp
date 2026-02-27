'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChecklistItem } from '@/components/ui/ChecklistItem';
import { useStore, getToBookProgress } from '@/lib/store';
import { TODO_ITEMS } from '@/lib/data';

const urgencyStyles: Record<string, string> = {
  high: 'bg-red-50 text-red-700',
  med: 'bg-amber-50 text-amber-800',
  low: 'bg-blue-50 text-blue-700',
};

const urgencyLabels: Record<string, string> = {
  high: '🔴 High',
  med: '🟡 Med',
  low: '🔵 Low',
};

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

function UserToBookRow({
  item,
  onDelete,
}: {
  item: { id: string; title: string; detail: string; urgency: 'high' | 'med' | 'low' };
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="w-full flex items-start gap-2 p-4 rounded-xl bg-surface border border-divider border-l-4 border-l-accent">
      <span className="text-[13px] text-text-secondary shrink-0 mt-0.5" aria-hidden>✏️</span>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-[15px] text-text-primary block">{item.title}</span>
        <p className="text-sm text-text-secondary mt-0.5">{item.detail}</p>
        <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded-full ${urgencyStyles[item.urgency]}`}>
          {urgencyLabels[item.urgency]}
        </span>
      </div>
      <div className="shrink-0">
        {confirming ? (
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs text-text-secondary">Delete?</span>
            <button type="button" onClick={() => { onDelete(); setConfirming(false); }} className="text-xs font-medium text-red-600">Yes</button>
            <button type="button" onClick={() => setConfirming(false)} className="text-xs font-medium text-text-secondary">No</button>
          </div>
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
  );
}

export default function ToBookPage() {
  const router = useRouter();
  const {
    toBookChecked,
    toggleToBook,
    resetToBook,
    userToBook = [],
    addUserToBook,
    removeUserToBook,
  } = useStore();
  const { completed, total } = getToBookProgress();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'med' | 'low'>('med');

  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setDetail('');
    setUrgency('med');
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
        <h1 className="font-semibold text-lg text-text-primary">To Book</h1>
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          {completed} of {total} completed
        </p>
        <button
          type="button"
          onClick={() => resetToBook()}
          className="text-xs font-medium text-accent active:opacity-70"
        >
          Reset All
        </button>
      </div>
      <p className="px-4 text-sm text-text-secondary border-b border-divider pb-4">
        Things from your plan that still need booking, plus items worth reserving in advance for March/April in Japan.
      </p>
      <div className="px-4 pt-6 space-y-4">
        <h2 className="text-sm font-bold text-text-primary">⚠️ From Your Plan — Not Yet Booked</h2>
        <div className="space-y-1.5">
          {TODO_ITEMS.slice(0, 6).map((item, i) => (
            <ChecklistItem
              key={item.title}
              text={item.title}
              detail={item.detail}
              badge={item.when}
              badgeClassName={urgencyStyles[item.urgency]}
              checked={toBookChecked[i] ?? false}
              onToggle={() => toggleToBook(i)}
            />
          ))}
        </div>
        <h2 className="text-sm font-bold text-text-primary pt-4">💡 Recommend Booking in Advance</h2>
        <div className="space-y-1.5">
          {TODO_ITEMS.slice(6).map((item, i) => (
            <ChecklistItem
              key={item.title}
              text={item.title}
              detail={item.detail}
              badge={item.when}
              badgeClassName={urgencyStyles[item.urgency]}
              checked={toBookChecked[6 + i] ?? false}
              onToggle={() => toggleToBook(6 + i)}
            />
          ))}
        </div>
        <h2 className="text-sm font-bold text-text-primary pt-4">✏️ Your items</h2>
        <div className="space-y-1.5">
          {userToBook.map((item) => (
            <UserToBookRow key={item.id} item={item} onDelete={() => removeUserToBook(item.id)} />
          ))}
          <AddItemButton onClick={() => setShowForm(true)} />
        </div>
        {showForm && (
          <div className="mt-2 p-4 rounded-xl border border-divider bg-surface space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
            />
            <input
              type="text"
              placeholder="Details"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-full rounded-lg border border-divider bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary min-h-[44px]"
            />
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Urgency</p>
            <div className="flex gap-2">
              {(['high', 'med', 'low'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${urgency === u ? urgencyStyles[u] : 'bg-stone-100 text-text-secondary'}`}
                >
                  {urgencyLabels[u]}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary active:opacity-70">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  const t = title.trim();
                  if (t) {
                    addUserToBook({ title: t, detail: detail.trim(), urgency });
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
