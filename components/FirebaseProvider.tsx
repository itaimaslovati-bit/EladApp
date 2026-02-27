'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';

const USER_NAME_KEY = 'userName';

function NamePrompt() {
  const setUserName = useStore((s) => s.setUserName);

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <p className="text-4xl mb-3">✌️</p>
        <h2 className="font-bold text-lg text-text-primary">Who&apos;s on this device?</h2>
        <p className="text-sm text-text-secondary mt-1 mb-6">
          So we know who took each photo
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setUserName('Tal')}
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg active:opacity-90"
          >
            Tal
          </button>
          <button
            type="button"
            onClick={() => setUserName('Elad')}
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg active:opacity-90"
          >
            Elad
          </button>
        </div>
      </div>
    </div>
  );
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const applyRemoteData = useStore((s) => s.applyRemoteData);
  const userName = useStore((s) => s.userName);
  const setUserName = useStore((s) => s.setUserName);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let unsub: (() => void) | undefined;
    const t = setTimeout(() => {
      import('@/lib/cloudSync')
        .then(({ subscribeToTripData }) => {
          unsub = subscribeToTripData((data) => {
            try {
              applyRemoteData(data);
            } catch (e) {
              console.warn('[Firebase] applyRemoteData failed:', e);
            }
          });
        })
        .catch((e) => console.warn('[Firebase] cloudSync load failed:', e));
    }, 100);
    return () => {
      clearTimeout(t);
      if (unsub) unsub();
    };
  }, [applyRemoteData]);

  useEffect(() => {
    try {
      const name = typeof window !== 'undefined' ? window.localStorage.getItem(USER_NAME_KEY) : null;
      if (name) setUserName(name);
    } catch (e) {
      console.warn('[Firebase] userName hydration failed:', e);
    }
    setHydrated(true);
  }, [setUserName]);

  const migrationRan = useRef(false);
  useEffect(() => {
    if (!hydrated || migrationRan.current || typeof window === 'undefined') return;
    import('@/lib/migrateMediaToCloud')
      .then(({ hasMigrated, migrateMediaToCloud }) =>
        hasMigrated().then((done) => {
          if (done) return;
          const name = useStore.getState().userName ?? 'Tal';
          migrationRan.current = true;
          migrateMediaToCloud(name).catch(() => {});
        })
      )
      .catch(() => {});
  }, [hydrated]);

  const showNamePrompt = hydrated && userName === null;

  return (
    <>
      {showNamePrompt && <NamePrompt />}
      {children}
    </>
  );
}
