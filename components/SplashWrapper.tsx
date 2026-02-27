'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from './SplashScreen';
import { FirebaseProvider } from './FirebaseProvider';
import { AppErrorBoundary } from './AppErrorBoundary';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const skip =
      process.env.NEXT_PUBLIC_SKIP_SPLASH === 'true' ||
      window.location.search.includes('nosplash');
    if (skip) setShowSplash(false);
  }, [mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FAFAF9]" />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AppErrorBoundary>
      <div className="opacity-100 transition-opacity duration-300">
        <FirebaseProvider>{children}</FirebaseProvider>
      </div>
    </AppErrorBoundary>
  );
}
