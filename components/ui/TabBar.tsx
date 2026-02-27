'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Calendar, Wallet, Train, MoreHorizontal } from 'lucide-react';

const TAB_CONFIG = [
  { href: '/today', label: 'Today', Icon: MapPin },
  { href: '/days', label: 'Days', Icon: Calendar },
  { href: '/bookings', label: 'Bookings', Icon: Wallet },
  { href: '/transport', label: 'Transport', Icon: Train },
  { href: '/more', label: 'More', Icon: MoreHorizontal },
] as const;

export function TabBar() {
  const pathname = usePathname();
  const basePath = pathname?.split('/')[1] ?? '';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-divider bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] pb-[env(safe-area-inset-bottom)] pt-3"
      style={{ minHeight: 'calc(49px + env(safe-area-inset-bottom))' }}
    >
      {TAB_CONFIG.map(({ href, label, Icon }) => {
        const isActive = pathname?.startsWith(href) ?? false;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 min-w-0 flex-1 py-1 transition-transform active:scale-[0.97]"
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={`w-6 h-6 shrink-0 ${isActive ? 'text-accent' : 'text-text-secondary'}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-[10px] font-medium truncate max-w-full ${isActive ? 'text-accent' : 'text-text-secondary'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
