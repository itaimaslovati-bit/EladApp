'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from './SplashScreen';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const skip =
      process.env.NEXT_PUBLIC_SKIP_SPLASH === 'true' ||
      window.location.search.includes('nosplash');
    if (skip) setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div
        className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}
      >
        {children}
      </div>
    </>
  );
}
