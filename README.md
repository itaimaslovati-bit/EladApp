# Japan Trip PWA

A Progressive Web App for the 39-day Japan trip (Tal & Elad), built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Installable on iOS/Android with offline support.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/overview`.

## Build

```bash
npm run build
npm start
```

## PWA Icons

Add these to `public/icons/` for full PWA support:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `apple-touch-icon.png` (180×180)

If missing, the app still runs; some environments may show a generic icon when added to home screen.

## Features

- **Overview** — Region-grouped timeline, filter by region, tap a day to open detail
- **Day by Day** — Accordion cards for all 39 days; deep link via `/days/[dayNumber]`
- **Bookings** — Cost summary and reservations (hotels, flights, cars, attractions)
- **Transport** — Getting around by region with tips
- **More** — Food guide, Emergency info, Phrases (tap to copy Japanese), Packing, Ideas, Checklist (persisted), To Book
- **Iran popup** — Easter egg on first visit (dismissed state in localStorage)

## Tech

- Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, Lucide React, next-pwa
# EladApp
# EladApp
