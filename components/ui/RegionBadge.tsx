'use client';

import { REGION_COLORS } from '@/lib/regions';
import type { Region } from '@/lib/types';

interface RegionBadgeProps {
  region: Region;
  label?: string;
  className?: string;
}

export function RegionBadge({ region, label, className = '' }: RegionBadgeProps) {
  const color = REGION_COLORS[region];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{ color }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label ?? region}
    </span>
  );
}
