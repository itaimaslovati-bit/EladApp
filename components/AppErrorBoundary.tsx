'use client';

import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('AppErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF9] text-center">
          <p className="text-lg font-semibold text-[#1C1917] mb-1">Something went wrong</p>
          <p className="text-sm text-[#78716C] mb-4 max-w-sm">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2.5 rounded-xl bg-[#EC4899] text-white font-medium text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
