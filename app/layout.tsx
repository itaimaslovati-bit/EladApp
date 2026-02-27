import type { Metadata, Viewport } from 'next';
import './globals.css';
import { IranPopup } from '@/components/IranPopup';

export const metadata: Metadata = {
  title: 'Japan Trip - Tal & Elad',
  description: '39-day Japan adventure planner',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Japan Trip',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1F2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Japan Trip" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased bg-[#FAFAF9] text-[#1C1917]">
        {children}
        <IranPopup />
      </body>
    </html>
  );
}
