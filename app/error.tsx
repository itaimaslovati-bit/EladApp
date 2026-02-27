'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <p className="text-lg font-semibold text-text-primary mb-1">Something went wrong</p>
      <p className="text-sm text-text-secondary mb-4 max-w-sm">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-accent text-white font-medium text-sm"
      >
        Try again
      </button>
    </div>
  );
}
