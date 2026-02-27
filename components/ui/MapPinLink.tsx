'use client';

import { MapPin } from 'lucide-react';

interface MapPinLinkProps {
  href: string;
  className?: string;
  size?: number;
}

export function MapPinLink({ href, className = '', size = 14 }: MapPinLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center text-text-secondary hover:text-accent active:scale-125 transition-all ${className}`}
      aria-label="Open in Maps"
    >
      <MapPin size={size} strokeWidth={2.5} />
    </a>
  );
}
