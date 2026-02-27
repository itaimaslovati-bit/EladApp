import type {
  OverviewDay,
  TripDay,
  CostRow,
  Reservation,
  TransportRegion,
  FoodRegion,
  EmergencyCard,
  PhraseCategory,
  PackingSection,
  ChecklistCategory,
  TodoItem,
  IdeaItem,
  Region,
} from './types';

const H = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// --- Overview (region-grouped days for main timeline) ---
export const OVERVIEW_DAYS: OverviewDay[] = [
  { dayNumber: 1, title: 'Landing Day', date: 'Sat, Mar 7 · Arrive 23:00 Haneda', region: 'tokyo', hotel: { name: 'Century Southern Tower', emoji: '🏨' }, mapsLink: H('Tokyo Haneda Airport Japan') },
  { dayNumber: 2, title: 'Shinjuku', date: 'Sun, Mar 8', region: 'tokyo', mapsLink: H('Shinjuku Tokyo Japan') },
  { dayNumber: 3, title: 'Harajuku & Shibuya', date: 'Mon, Mar 9', region: 'tokyo' },
  { dayNumber: 4, title: 'Shimokitazawa & Roppongi', date: 'Tue, Mar 10', region: 'tokyo' },
  { dayNumber: 5, title: 'Travel to Kyoto', date: 'Wed, Mar 11 · Shinkansen', region: 'kyoto', hotel: { name: 'Cross Hotel Kyoto', emoji: '🏨' }, mapsLink: H('Kyoto Station Japan') },
  { dayNumber: 6, title: 'Arashiyama & Kinkaku-ji', date: 'Thu, Mar 12', region: 'kyoto' },
  { dayNumber: 7, title: 'Nara Day Trip', date: 'Fri, Mar 13', region: 'kyoto', mapsLink: H('Nara Park Japan') },
  { dayNumber: 8, title: "Philosopher's Path & Kiyomizu-dera", date: 'Sat, Mar 14', region: 'kyoto' },
  { dayNumber: 9, title: 'Travel to Osaka', date: 'Sun, Mar 15 · Fushimi Inari?', region: 'osaka', hotel: { name: 'Hotel Granvia Osaka', emoji: '🏨' }, mapsLink: H('Fushimi Inari Shrine Kyoto Japan') },
  { dayNumber: 10, title: 'Universal Studios', date: 'Mon, Mar 16', region: 'osaka', mapsLink: H('Universal Studios Japan Osaka') },
  { dayNumber: 11, title: 'Osaka Free Day', date: 'Tue, Mar 17', region: 'osaka', mapsLink: H('Dotonbori Osaka Japan') },
  { dayNumber: 12, title: 'Shirakawa-go → Takayama', date: 'Wed, Mar 18 · Pick up car in Nagoya', region: 'rural', hotel: { name: 'Takayama hotel', emoji: '🏨' }, mapsLink: H('Shirakawa-go Japan') },
  { dayNumber: 13, title: 'Takayama → Matsumoto', date: 'Thu, Mar 19 · Morning market, Hirayu Onsen', region: 'rural', hotel: { name: 'Onyado Nono Matsumoto', emoji: '♨️' }, mapsLink: H('Takayama Old Town Japan') },
  { dayNumber: 14, title: 'Kiso Valley · Naraijuku', date: 'Fri, Mar 20', region: 'rural', hotel: { name: 'Nukumorino-yado Komanoyu', emoji: '🏨' }, mapsLink: H('Narai-juku Nagano Japan') },
  { dayNumber: 15, title: 'Nakasendo Trail: Tsumago ⇄ Magome', date: 'Sat, Mar 21 · 3-3.5 hr hike', region: 'rural', hotel: { name: 'Enakyo Onsen Hotel', emoji: '♨️' }, mapsLink: H('Tsumago Post Town Japan') },
  { dayNumber: 16, title: 'Return Car → Shinkansen to Fukuoka', date: 'Sun, Mar 22 · Car drop-off Nagoya', region: 'kyushu', hotel: { name: 'Richmon Hotel Tenjin', emoji: '🏨' }, mapsLink: H('Hakata Station Fukuoka Japan') },
  { dayNumber: 17, title: 'Fukuoka · Canal City', date: 'Mon, Mar 23', region: 'kyushu', mapsLink: H('Canal City Hakata Fukuoka Japan') },
  { dayNumber: 18, title: 'Nokonoshima / Uminonakamichi', date: 'Tue, Mar 24', region: 'kyushu', mapsLink: H('Nokonoshima Island Park Fukuoka Japan') },
  { dayNumber: 19, title: 'Kitsuki → Beppu', date: 'Wed, Mar 25 · Samurai district', region: 'kyushu', hotel: { name: 'Nihonryokan Utsuwa', emoji: '♨️' }, mapsLink: H('Kitsuki Castle Town Oita Japan') },
  { dayNumber: 20, title: 'Hells of Beppu', date: 'Thu, Mar 26', region: 'kyushu', mapsLink: H('Beppu Jigoku Hells Japan') },
  { dayNumber: 21, title: 'Beppu · Mt. Tsurumi?', date: 'Fri, Mar 27', region: 'kyushu', mapsLink: H('Mount Tsurumi Beppu Japan') },
  { dayNumber: 22, title: 'Yufuin · Glamping', date: 'Sat, Mar 28 · Floral Village, Lake Kinrin', region: 'kyushu', hotel: { name: 'Sense of Wonder Glamping', emoji: '⛺' }, mapsLink: H('Yufuin Floral Village Japan') },
  { dayNumber: 23, title: 'Takachiho · Kagura Night Show', date: 'Sun, Mar 29 · Kokonoe Bridge · 🎭 Kagura 20:00', region: 'kyushu', hotel: { name: 'Solest Takachiho', emoji: '🏨' }, mapsLink: H('Takachiho Shrine Miyazaki Japan') },
  { dayNumber: 24, title: 'Takachiho Gorge → Aso', date: 'Mon, Mar 30 · Boat tour, Amanoiwato Shrine', region: 'aso', hotel: { name: 'Fairfield Marriott Aso', emoji: '🏨' }, mapsLink: H('Takachiho Gorge Miyazaki Japan') },
  { dayNumber: 25, title: 'Kusasenri Observatory', date: 'Tue, Mar 31', region: 'aso', mapsLink: H('Kusasenri Aso Kumamoto Japan') },
  { dayNumber: 26, title: 'Aso Free Day', date: 'Wed, Apr 1', region: 'aso', mapsLink: H('Mount Aso Kumamoto Japan') },
  { dayNumber: 27, title: 'Aso Free Day', date: 'Thu, Apr 2', region: 'aso' },
  { dayNumber: 28, title: 'Fly to Ishigaki', date: 'Fri, Apr 3 · Peach 12:20', region: 'okinawa', hotel: { name: 'Seven x Seven Ishigaki', emoji: '🏨' }, mapsLink: H('Ishigaki Island Okinawa Japan') },
  { dayNumber: 29, title: 'Ishigaki', date: 'Sat, Apr 4', region: 'okinawa', mapsLink: H('Kabira Bay Ishigaki Japan') },
  { dayNumber: 30, title: 'Ishigaki', date: 'Sun, Apr 5', region: 'okinawa' },
  { dayNumber: 31, title: 'Ishigaki', date: 'Mon, Apr 6', region: 'okinawa' },
  { dayNumber: 32, title: 'Fly to Miyakojima', date: 'Tue, Apr 7 · ANA 8:30', region: 'okinawa', hotel: { name: 'Tokyu Hotel Resort', emoji: '🏨' }, mapsLink: H('Miyakojima Okinawa Japan') },
  { dayNumber: 33, title: 'Miyakojima', date: 'Wed, Apr 8', region: 'okinawa', mapsLink: H('Yonaha Maehama Beach Miyakojima Japan') },
  { dayNumber: 34, title: 'Miyakojima', date: 'Thu, Apr 9', region: 'okinawa' },
  { dayNumber: 35, title: 'Fly to Tokyo · Ginza', date: 'Fri, Apr 10 · JAL 14:35', region: 'tokyo', hotel: { name: 'Royal Park Canvas Ginza', emoji: '🏨' }, mapsLink: H('Ginza Tokyo Japan') },
  { dayNumber: 36, title: 'Mt. Fuji Five Lakes Day Trip', date: 'Sat, Apr 11', region: 'tokyo', mapsLink: H('Lake Kawaguchi Mount Fuji Japan') },
  { dayNumber: 37, title: 'Tokyo', date: 'Sun, Apr 12', region: 'tokyo', mapsLink: H('Akihabara Tokyo Japan') },
  { dayNumber: 38, title: 'TeamLab Planets', date: 'Mon, Apr 13', region: 'tokyo', mapsLink: H('TeamLab Planets Tokyo Japan') },
  { dayNumber: 39, title: 'Departure Day', date: 'Tue, Apr 14 · Evening flight Haneda', region: 'tokyo', mapsLink: H('Tokyo Haneda Airport Japan') },
];

// --- Cost summary ---
export const COST_SUMMARY: CostRow[] = [
  { label: 'Accommodation (38 nights)', amount: '₪~30,215' },
  { label: 'Domestic Flights (3)', amount: '₪~5,700' },
  { label: 'Car Rentals (3)', amount: '₪~6,200' },
  { label: 'Attractions (Universal, TeamLab)', amount: '₪~1,942' },
  { label: 'Estimated Total', amount: '₪~44,000', isTotal: true },
];

export const COST_SUMMARY_NOTE = 'Excluding: international flights, food, trains, daily expenses';

// --- Reservations ---
export const RESERVATIONS_HOTELS: Reservation[] = [
  { title: 'Hotel Century Southern Tower', details: [{ label: 'Location', value: 'Shinjuku, Tokyo' }, { label: 'Dates', value: 'Mar 7-11 (4 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪4,004' }], price: '₪4,004' },
  { title: 'Cross Hotel Kyoto', details: [{ label: 'Location', value: 'Nakagyo-ku, Kyoto' }, { label: 'Dates', value: 'Mar 11-15 (4 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪2,080' }], price: '₪2,080' },
  { title: 'Hotel Granvia Osaka (JR)', details: [{ label: 'Location', value: 'Osaka Station' }, { label: 'Dates', value: 'Mar 15-18 (3 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪1,310 + ₪1,721' }], price: '₪1,310 + ₪1,721' },
  { title: 'Takayama Hotel (Ascend Collection)', details: [{ label: 'Location', value: 'Takayama' }, { label: 'Dates', value: 'Mar 18-19 (1 night)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪437' }], price: '₪437' },
  { title: 'Onyado Nono Matsumoto Hot Spring', details: [{ label: 'Location', value: 'Matsumoto' }, { label: 'Dates', value: 'Mar 19-20 (1 night)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪468' }], price: '₪468' },
  { title: 'Nukumorino-yado Komanoyu', details: [{ label: 'Location', value: 'Fukushima-juku, Kiso Valley' }, { label: 'Dates', value: 'Mar 20-21 (1 night)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪1,017' }], price: '₪1,017' },
  { title: 'Enakyo Onsen Hotel Yuzuriha', details: [{ label: 'Location', value: 'Nakatsugawa' }, { label: 'Dates', value: 'Mar 21-22 (1 night)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪707' }], price: '₪707' },
  { title: 'Richmon Hotel Tenjin', details: [{ label: 'Location', value: 'Tenjin, Fukuoka' }, { label: 'Dates', value: 'Mar 22-25 (3 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪1,417' }], price: '₪1,417' },
  { title: 'Nihonryokan Utsuwa Beppu Kannawa', details: [{ label: 'Location', value: 'Beppu' }, { label: 'Dates', value: 'Mar 25-28 (3 nights)' }, { label: 'Booked via', value: 'Booking.com (Elad)' }, { label: 'Cost', value: '₪1,483' }], price: '₪1,483' },
  { title: 'Sense of Wonder Glamping Resort', details: [{ label: 'Location', value: 'Yufudake, Yufu' }, { label: 'Dates', value: 'Mar 28-29 (1 night)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪982' }], price: '₪982' },
  { title: 'Solest Takachiho Hotel', details: [{ label: 'Location', value: 'Takachiho' }, { label: 'Dates', value: 'Mar 29-30 (1 night)' }, { label: 'Booked via', value: 'Booking.com (Elad)' }, { label: 'Cost', value: '₪642' }], price: '₪642' },
  { title: 'Fairfield by Marriott Kumamoto Aso', details: [{ label: 'Location', value: 'Aso' }, { label: 'Dates', value: 'Mar 30 - Apr 3 (4 nights)' }, { label: 'Booked via', value: 'Booking.com (Elad)' }, { label: 'Cost', value: '₪2,548' }], price: '₪2,548' },
  { title: 'Seven x Seven Ishigaki', details: [{ label: 'Location', value: 'Ishigaki, Okinawa' }, { label: 'Dates', value: 'Apr 3-7 (4 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪4,280' }], price: '₪4,280' },
  { title: 'Tokyu Hotel Resort', details: [{ label: 'Location', value: 'Miyakojima, Okinawa' }, { label: 'Dates', value: 'Apr 7-10 (3 nights)' }, { label: 'Booked via', value: 'Agoda' }, { label: 'Cost', value: '₪2,791' }], price: '₪2,791' },
  { title: 'The Royal Park Canvas Ginza Corridor', details: [{ label: 'Location', value: 'Ginza, Tokyo' }, { label: 'Dates', value: 'Apr 10-14 (4 nights)' }, { label: 'Booked via', value: '—' }, { label: 'Cost', value: '₪4,328' }], price: '₪4,328' },
];

export const RESERVATIONS_DINING: Reservation[] = [
  { title: 'Gyopao Gyoza Roppongi', details: [{ label: 'Date', value: 'Tue, Mar 10 at 19:30' }, { label: 'Location', value: 'Roppongi, Tokyo' }, { label: 'Day', value: 'Day 4' }] },
  { title: 'Takachiho Kagura Night Performance', details: [{ label: 'Date', value: 'Sun, Mar 29 at 20:00' }, { label: 'Location', value: 'Takachiho Shrine, Miyazaki' }, { label: 'Day', value: 'Day 23' }, { label: 'Cost', value: '₪25 (~¥1,000 at the door)' }], price: '₪25 (~¥1,000 at the door)' },
];

export const RESERVATIONS_FLIGHTS: Reservation[] = [
  { title: 'Fukuoka → Ishigaki', details: [{ label: 'Date', value: 'Apr 3 · 12:20' }, { label: 'Airline', value: 'Peach (last minute)' }, { label: 'Cost', value: '₪1,068' }], price: '₪1,068' },
  { title: 'Ishigaki → Miyakojima', details: [{ label: 'Date', value: 'Apr 7 · 8:30' }, { label: 'Airline', value: 'ANA' }, { label: 'Cost', value: '₪430 (€110)' }], price: '₪430 (€110)' },
  { title: 'Miyakojima → Tokyo', details: [{ label: 'Date', value: 'Apr 10 · 14:35' }, { label: 'Airline', value: 'JAL (via trip.com)' }, { label: 'Cost', value: '₪1,000 ($270.80)' }], price: '₪1,000 ($270.80)' },
];

export const RESERVATIONS_CARS: Reservation[] = [
  { title: 'Central Japan (Nagoya pickup & return)', details: [{ label: 'Dates', value: 'Mar 18 → Mar 22' }, { label: 'Company', value: 'Budget (via Klook)' }, { label: 'Cost', value: '₪1,350 ($365)' }], price: '₪1,350 ($365)' },
  { title: 'Kyushu (Fukuoka area)', details: [{ label: 'Dates', value: '~Mar 24 → Apr 3' }, { label: 'Company', value: 'Budget' }, { label: 'Cost', value: '₪~1,800' }], price: '₪~1,800' },
  { title: 'Ishigaki', details: [{ label: 'Dates', value: 'Apr 3-7' }, { label: 'Company', value: 'Nissan Rent-a-Car' }, { label: 'Cost', value: '₪~720' }], price: '₪~720' },
  { title: 'Miyakojima', details: [{ label: 'Dates', value: 'Apr 7-10' }, { label: 'Company', value: 'Budget (via Klook)' }, { label: 'Cost', value: '₪965 ($261)' }], price: '₪965 ($261)' },
];

export const RESERVATIONS_ATTRACTIONS: Reservation[] = [
  { title: 'Universal Studios Japan', details: [{ label: 'Date', value: 'Mar 16' }, { label: 'Booked via', value: 'Klook' }, { label: 'Cost', value: '₪1,721' }], price: '₪1,721' },
  { title: 'TeamLab Planets', details: [{ label: 'Date', value: 'Apr 13 (reserved)' }, { label: 'Booked via', value: 'Official site' }, { label: 'Cost', value: '₪221' }], price: '₪221' },
  { title: 'Takachiho Gorge Boat Tour', details: [{ label: 'Date', value: 'Mar 30' }, { label: 'Book on', value: 'Mar 16!' }, { label: 'Cost', value: '—' }] },
];

// --- Transport ---
export const TRANSPORT_REGIONS: TransportRegion[] = [
  {
    title: '🗼 Getting Around Tokyo (Days 1-4)',
    legs: [
      { dayLabel: 'DAY 1', route: 'Haneda Airport → Hotel Century Southern Tower, Shinjuku', method: '🚕 Taxi (pre-book)', details: 'Why taxi? You land at 23:00 — trains and buses stop around midnight. Duration ~40 min. Cost ~6,000–8,000 yen (~$40–55).', tip: '💡 Pre-book via your hotel or use the JapanTaxi app. Airport taxi stands have flat-rate options to Shinjuku.' },
      { dayLabel: 'DAYS 2-4', route: 'Within Tokyo', method: '🚃 JR Lines + Tokyo Metro (Suica)', details: 'How: Tap your Suica/Pasmo IC card on any train or metro. Key lines: JR Yamanote (loop), Chuo, Metro Ginza/Marunouchi/Hibiya. Cost: ~150-200 yen per ride', tip: '💡 Load your Suica with at least 3,000 yen. Works on trains, buses, and convenience stores.' },
    ],
  },
  {
    title: '⛩️ Tokyo → Kyoto & Around (Days 5-8)',
    legs: [
      { dayLabel: 'DAY 5', route: 'Shinjuku → Kyoto', method: '🚅 Shinkansen (Nozomi)', details: 'Step 1: JR Chuo Line from Shinjuku to Shinagawa (~18 min, Suica OK). Step 2: Nozomi Shinkansen from Shinagawa to Kyoto (~2h10). Total ~2h30 door-to-door. Cost ~13,320 yen (~$90) for reserved seat. Reservation: Recommended — reserve at JR ticket office or SmartEX app.', tip: '💡 Sit on the RIGHT side (seats D/E) for Mt. Fuji views! Best visible around Shin-Fuji station.' },
      { dayLabel: 'DAYS 5-8', route: 'Within Kyoto', method: '🚌 Bus + 🚃 Train + 🚶 Walk', details: 'Buses: Kyoto City Bus #5, #100, #101 cover most tourist spots. Suica OK. Trains: JR for Arashiyama & Fushimi Inari. Keihan Line for Gion. Cost: Bus: 230 yen flat. Train: 150-250 yen.', tip: '💡 Kyoto is very walkable in the central/Gion area. Use buses for Arashiyama and Kinkaku-ji.' },
      { dayLabel: 'DAY 7', route: 'Kyoto → Nara (day trip)', method: '🚃 JR Nara Line (Miyakoji Rapid)', details: 'From: JR Kyoto Station. Duration: ~45 min (Miyakoji Rapid, no transfer). Cost: 720 yen one way. Suica OK. Alternative: Kintetsu Line from Kintetsu Kyoto Stn (~35 min, 640 yen).', tip: '💡 Nara\'s attractions (deer park, Todai-ji) are a 15-min walk from JR Nara Station.' },
    ],
  },
  {
    title: '🏯 Kyoto → Osaka (Days 9-11)',
    legs: [
      { dayLabel: 'DAY 9', route: 'Kyoto → Fushimi Inari → Osaka', method: '🚃 JR Nara Line + JR Special Rapid', details: 'Option A: Stop at Fushimi Inari first: JR Kyoto → JR Inari (5 min, 150 yen). Then JR Inari → Osaka (45 min). Option B: Direct: JR Special Rapid from Kyoto to Osaka (~29 min, 570 yen). Suica OK. Hotel: Hotel Granvia is directly inside JR Osaka Station — zero walking.', tip: '💡 Fushimi Inari is literally next to JR Inari station. Just leave your luggage at Kyoto Station coin lockers first.' },
      { dayLabel: 'DAYS 9-11', route: 'Within Osaka', method: '🚃 Osaka Metro (Suica)', details: 'Key lines: Midosugi Line (north-south), Chuo Line. Suica OK everywhere. USJ: JR Yumesaki Line from Osaka Station to Universal City (~11 min, 180 yen). Cost: ~180-280 yen per ride' },
    ],
  },
  {
    title: '🚗 Central Japan by Car (Days 12-15)',
    legs: [
      { dayLabel: 'DAY 12', route: 'Osaka → Nagoya (then pick up car)', method: '🚅 Shinkansen (Nozomi)', details: 'From: JR Shin-Osaka Station (take Midosugi metro from Osaka Stn, 1 stop). Duration: Shin-Osaka → Nagoya: ~50 min. Cost: ~5,940 yen (~$40). Then: Pick up rental car near Nagoya Station. Drive to Shirakawa-go (~2.5 hrs).', tip: '💡 No Shinkansen reservation needed for this short leg — unreserved cars are fine (cars 1-3).' },
      { dayLabel: 'DAYS 12-15', route: 'Driving: Shirakawa-go → Takayama → Matsumoto → Kiso → Nakasendo', method: '🚗 Rental Car (Budget via Klook)', details: 'Roads: Well-maintained mountain roads. Some toll highways (ETC card recommended). Fuel: Gas stations close early in rural areas (by 19:00-20:00). GPS: Use Google Maps — set to avoid toll roads if you prefer scenic routes.', tip: '💡 Get an ETC card from the rental company for automatic toll payment. Saves stopping at every booth.' },
    ],
  },
  {
    title: '🚅 Central Japan → Kyushu (Day 16)',
    legs: [
      { dayLabel: 'DAY 16', route: 'Return Car in Nagoya → Shinkansen to Fukuoka', method: '🚅 Shinkansen (Nozomi)', details: 'Step 1: Return car at Nagoya Station area. Step 2: Nozomi Shinkansen: Nagoya → Hakata (Fukuoka). ~3h20. Cost: ~17,890 yen (~$120) reserved seat. Reservation: Recommended for this long ride — SmartEX app or JR counter.', tip: '💡 This is a long ride — grab an ekiben (train bento) at Nagoya Station. Try the Tenmusu or Miso Katsu bento!' },
    ],
  },
  {
    title: '🚗 Kyushu by Car (Days 17-28)',
    legs: [
      { dayLabel: 'DAY 18', route: 'Fukuoka → Nokonoshima Island', method: '🚃 Subway + ⛴️ Ferry', details: 'Step 1: Subway from Tenjin to Meinohama Station (~10 min, Suica OK). Step 2: Walk 5 min to Noko Ferry Terminal (Meinohama Port). Step 3: Ferry to Nokonoshima (~10 min, 230 yen each way). Alternative: Uminonakamichi: take JR from Hakata Station (~25 min).', tip: '💡 Check the ferry schedule — boats run every 30-60 min. Last ferry back is around 17:30.' },
      { dayLabel: 'DAYS 19-23', route: 'Kitsuki → Beppu → Yufuin → Takachiho', method: '🚗 Rental Car', details: 'Key drives: Fukuoka → Kitsuki: ~2h via Oita Expressway. Kitsuki → Beppu: ~40 min. Beppu → Yufuin: ~1h (scenic Yamanami Highway). Yufuin → Takachiho: ~2.5h via Kokonoe Bridge. Takachiho → Aso: ~1.5h', tip: '💡 The Yamanami Highway is one of Japan\'s most scenic drives. Take it slow and stop at viewpoints!' },
    ],
  },
  {
    title: '✈️ Kyushu → Okinawa (Days 28-34)',
    legs: [
      { dayLabel: 'DAY 28', route: 'Aso Area → Ishigaki Island', method: '🚗 Drive + ✈️ Peach Aviation', details: 'Step 1: Drive from Aso area to Fukuoka Airport & drop off car (~2h). Step 2: Peach flight at 12:20 to Ishigaki (~2h). Step 3: Pick up Nissan rental car at Ishigaki Airport.', tip: '💡 Peach is a budget airline — check baggage limits. Arrive 1.5h before departure.' },
      { dayLabel: 'DAYS 28-31', route: 'Ishigaki Island', method: '🚗 Rental Car + ⛴️ Ferries', details: 'Island: Ishigaki is small — everything within 30-40 min drive. Taketomi: Ferry from Ishigaki Port (~15 min, ~1,400 yen round trip). Ferries every 30 min. Iriomote: Ferry from Ishigaki Port (~40 min, ~4,400 yen round trip).' },
      { dayLabel: 'DAY 32', route: 'Ishigaki → Miyakojima', method: '✈️ ANA Flight', details: 'Flight: ANA 8:30 departure. ~30 min flight. Car: Drop off Ishigaki rental at airport. Pick up Budget car at Miyakojima Airport.', tip: '💡 Very short flight! Sit on the left for ocean views.' },
    ],
  },
  {
    title: '🗼 Okinawa → Tokyo Return (Days 35-39)',
    legs: [
      { dayLabel: 'DAY 35', route: 'Miyakojima → Tokyo', method: '✈️ JAL Flight', details: 'Flight: JAL 14:35 departure. Likely with a connection. Car: Drop off rental at Miyakojima Airport in the morning. Arrival: Haneda Airport. Take Keikyu Line or monorail to central Tokyo. To hotel: Keikyu to Shinbashi (~30 min), walk to Ginza hotel (~10 min). Or taxi (~5,000 yen).' },
      { dayLabel: 'DAY 36', route: 'Tokyo → Kawaguchiko (Mt. Fuji day trip)', method: '🚃 JR Chuo Line + Fuji Excursion', details: 'Option A: Direct: "Fuji Excursion" limited express from Shinjuku to Kawaguchiko (~1h50, ~4,130 yen). Reserved seats only — book ahead! Option B: Highway bus from Shinjuku Expressway Bus Terminal (~1h45, ~2,000 yen). Cheaper but less reliable timing. Return: Same route back. Last Fuji Excursion departs Kawaguchiko ~18:00.', tip: '💡 The Fuji Excursion train sells out on weekends — book at JR ticket counter or online the day before!' },
      { dayLabel: 'DAYS 35-39', route: 'Within Tokyo (Return)', method: '🚃 JR + Metro (Suica)', details: 'Hotel area: Ginza — well connected via Ginza Line, Hibiya Line, Marunouchi Line. TeamLab: Yurikamome Line to Toyosu (~15 min from Shinbashi).' },
      { dayLabel: 'DAY 39', route: 'Ginza Hotel → Haneda Airport', method: '🚃 Train or 🚕 Taxi', details: 'Train: Ginza → Shinbashi (walk/metro), Keikyu Line to Haneda (~30 min, ~420 yen). Taxi: ~30 min, ~5,000–7,000 yen. Easier with luggage. Timing: Allow 2.5h before international departure.', tip: '💡 With 39 days of luggage, a taxi to the airport is worth the splurge. Book via JapanTaxi app.' },
    ],
  },
];

// --- Food ---
export const FOOD_REGIONS: FoodRegion[] = [
  {
    title: '🗼 Tokyo (Days 1-4 & 35-39)',
    items: [
      { emoji: '🍜', name: 'Tsukemen', description: 'Thick dipping ramen. Try Fuunji near Shinjuku Station — always a queue but worth it.' },
      { emoji: '🍣', name: 'Sushi at Tsukiji Outer Market', description: 'Fresh sushi breakfast. Go early (7-8 AM). Sushi Dai and Daiwa are famous but long waits.' },
      { emoji: '🥟', name: 'Gyoza', description: "You've got Gyopao Gyoza booked on Day 4! Pan-fried is the Tokyo style." },
      { emoji: '🫓', name: 'Monjayaki', description: "Tokyo's answer to okonomiyaki — runnier and eaten straight off the griddle. Try in Tsukishima district." },
      { emoji: '🍢', name: 'Yakitori at Omoide Yokocho', description: 'Smoky grilled chicken skewers in the tiny alleys of Memory Lane, Shinjuku. ~100-200 yen per stick.' },
    ],
  },
  {
    title: '⛩️ Kyoto (Days 5-8)',
    items: [
      { emoji: '🍵', name: 'Matcha Everything', description: 'Matcha latte, matcha ice cream, matcha mochi. Nishiki Market has great options. Nakamura Tokichi in Uji is legendary.' },
      { emoji: '🥘', name: 'Yudofu (Hot Tofu)', description: 'Kyoto specialty — silky tofu in hot broth. Try near Nanzen-ji temple area.' },
      { emoji: '🥩', name: 'Wagyu Beef', description: 'You planned a wagyu dinner on Day 6. Kyoto-style wagyu is often served as steak or sukiyaki.' },
      { emoji: '🍡', name: 'Yatsuhashi & Street Sweets', description: 'Cinnamon-flavored mochi triangles. Fresh ones (nama yatsuhashi) from Nishiki Market are the best souvenirs.' },
      { emoji: '🍶', name: 'Sake Tasting', description: "Fushimi (near Fushimi Inari) is one of Japan's top sake-brewing districts. Gekkeikan Okura museum offers tastings." },
    ],
  },
  {
    title: '🏯 Osaka (Days 9-11)',
    items: [
      { emoji: '🐙', name: 'Takoyaki', description: "Crispy octopus balls. Osaka's signature street food. Try Wanaka or Kukuru in Dotonbori." },
      { emoji: '🫓', name: 'Okonomiyaki', description: 'Savory "Japanese pancake" with cabbage, pork, and toppings. Osaka-style is mixed, not layered (that\'s Hiroshima).' },
      { emoji: '🍢', name: 'Kushikatsu', description: 'Deep-fried skewers in Shinsekai district. Rule: NO double-dipping in the shared sauce!' },
      { emoji: '🦀', name: 'Kani Doraku (Crab)', description: 'The giant crab sign on Dotonbori is iconic. Worth trying a crab course meal.' },
    ],
  },
  {
    title: '🏔️ Central Japan (Days 12-15)',
    items: [
      { emoji: '🥩', name: 'Hida Beef', description: "Takayama's premium wagyu. Try Hida beef sushi (on rice crackers) at the morning market — ~500 yen per piece." },
      { emoji: '🍡', name: 'Mitarashi Dango', description: 'Grilled rice dumplings with sweet soy sauce glaze. Found everywhere in Takayama.' },
      { emoji: '🍜', name: 'Soba Noodles', description: 'Kiso Valley & Matsumoto area are famous for handmade buckwheat soba. Try cold "zaru soba" if weather is warm.' },
      { emoji: '🍎', name: 'Gohei Mochi', description: 'Grilled rice cake on a stick with sweet miso/walnut paste. Common along the Nakasendo trail in Magome & Tsumago.' },
    ],
  },
  {
    title: '🌋 Fukuoka & Kyushu (Days 16-27)',
    items: [
      { emoji: '🍜', name: 'Hakata Ramen', description: 'Rich, creamy tonkotsu (pork bone) broth with thin noodles. Try the yatai (street stalls) along the river in Tenjin/Nakasu. Order "kaedama" for a noodle refill.' },
      { emoji: '🐟', name: 'Mentaiko', description: "Spicy marinated cod roe — Fukuoka's pride. Eat it on rice, in onigiri, or as pasta. Buy some as omiyage (gifts)!" },
      { emoji: '♨️', name: 'Jigoku Mushi (Hell-steamed)', description: 'Food steamed in natural hot spring steam in Beppu. You\'re going to Jigoku Mushi Kobo on Day 19!' },
      { emoji: '🍮', name: 'Jigokumushi Pudding', description: 'Custard pudding steamed in onsen steam. Okamotoya in Beppu on Day 21.' },
      { emoji: '🐓', name: 'Toriten', description: "Oita's signature chicken tempura. Light and crispy, served with ponzu and karashi mustard." },
    ],
  },
  {
    title: '🏖️ Okinawa / Ishigaki / Miyakojima (Days 28-34)',
    items: [
      { emoji: '🥬', name: 'Goya Champuru', description: "Stir-fried bitter melon with tofu, pork, and egg. Okinawa's signature dish — an acquired taste but try it!" },
      { emoji: '🍜', name: 'Okinawa Soba', description: "Not like mainland soba — thick wheat noodles in pork broth with soki (spare ribs). Comfort food." },
      { emoji: '🍇', name: 'Umibudo (Sea Grapes)', description: 'Tiny green seaweed bubbles that pop in your mouth. Fresh and unique to Okinawa. Try with soy sauce.' },
      { emoji: '🐐', name: 'Ishigaki Beef', description: 'Ishigaki raises its own premium wagyu. Less famous than Kobe but equally delicious and cheaper.' },
      { emoji: '🍺', name: 'Awamori', description: 'Okinawan rice spirit, stronger than sake. Try it on the rocks or as a cocktail. Start with a mild one!' },
    ],
  },
];

// --- Emergency ---
export const EMERGENCY_CARDS: EmergencyCard[] = [
  {
    title: '🚨 Emergency Numbers',
    urgent: true,
    items: [
      { label: 'Police', value: '110', big: true },
      { label: 'Fire / Ambulance', value: '119', big: true },
      { label: 'Japan Helpline (English, 24/7)', value: '0570-000-911' },
      { label: 'Tourist Hotline (English)', value: '050-3816-2787' },
    ],
  },
  {
    title: '🏛️ Embassy of Israel in Tokyo',
    items: [
      { label: 'Address', value: '3 Chome-Nibancho, Chiyoda-ku, Tokyo' },
      { label: 'Phone', value: '03-3264-0911' },
      { label: 'Emergency (after hours)', value: '03-3264-0911' },
      { label: 'Hours', value: 'Sun-Thu 9:00-12:00' },
    ],
  },
  {
    title: '🏥 English-Friendly Hospitals',
    items: [
      { label: 'Tokyo', value: "St. Luke's International Hospital (Tsukiji)" },
      { label: 'Kyoto', value: 'Japan Baptist Hospital' },
      { label: 'Osaka', value: 'Osaka University Hospital (Suita)' },
      { label: 'Fukuoka', value: 'Fukuoka Sanno Hospital' },
      { label: 'Okinawa', value: 'US Naval Hospital Okinawa (Camp Foster)' },
    ],
  },
  {
    title: '💊 At the Pharmacy',
    items: [
      { label: '"I need medicine"', value: 'Kusuri ga hoshii desu' },
      { label: '"Headache"', value: 'Zutsuu' },
      { label: '"Stomachache"', value: 'Onaka ga itai' },
      { label: '"Fever"', value: 'Netsu ga arimasu' },
      { label: '"Allergy"', value: 'Arerugi' },
      { label: 'Pharmacy chains', value: 'Matsumoto Kiyoshi, Sugi, Welcia (open late)' },
    ],
  },
  {
    title: '📄 Lost Passport',
    items: [
      { label: 'Step 1', value: 'File police report (Koban)' },
      { label: 'Step 2', value: 'Go to Israel Embassy with report' },
      { label: 'Step 3', value: 'Get emergency travel document' },
      { label: 'Tip', value: 'Keep a photo of your passport on your phone!' },
    ],
  },
  {
    title: '💰 Money & Payments',
    items: [
      { label: 'Currency', value: 'Japanese Yen (JPY / ¥)' },
      { label: 'ATMs', value: '7-Eleven & Japan Post ATMs accept foreign cards' },
      { label: 'Cards', value: 'Visa/Mastercard widely accepted in cities. Cash needed in rural areas.' },
      { label: 'Tipping', value: 'NEVER tip. It\'s considered rude.' },
      { label: 'Tax-free', value: 'Spend 5,000+ yen at one store → show passport → tax-free' },
    ],
  },
  {
    title: '📱 Connectivity',
    items: [
      { label: 'eSIM', value: 'Ubigi, Airalo, or Mobal. Activate before landing.' },
      { label: 'Pocket WiFi', value: 'Rent at airport or order online (Japan Wireless, WiFi Rental)' },
      { label: 'Free WiFi', value: 'Convenience stores, stations, Starbucks. Unreliable elsewhere.' },
    ],
  },
  {
    title: '🔌 Practical Info',
    items: [
      { label: 'Power outlets', value: 'Type A (US-style, 2 flat prongs). 100V.' },
      { label: 'Adapter needed?', value: 'Israeli plugs need a Type A adapter. Buy one before the trip.' },
      { label: 'Tap water', value: 'Safe to drink everywhere' },
      { label: 'Trash', value: 'No public bins! Carry a small bag. Convenience stores have bins.' },
      { label: 'Shoes', value: 'Remove shoes when entering homes, ryokans, some restaurants (look for shoe racks)' },
    ],
  },
];

// --- Phrases ---
export const PHRASE_CATEGORIES: PhraseCategory[] = [
  { title: '👋 Basics', phrases: [
    { en: 'Hello', jp: 'Konnichiwa' }, { en: 'Good morning', jp: 'Ohayou gozaimasu' }, { en: 'Good evening', jp: 'Konbanwa' },
    { en: 'Thank you', jp: 'Arigatou gozaimasu' }, { en: 'Excuse me / Sorry', jp: 'Sumimasen' }, { en: 'Yes / No', jp: 'Hai / Iie' },
    { en: "I don't understand", jp: 'Wakarimasen' }, { en: 'Do you speak English?', jp: 'Eigo wa hanasemasu ka?' }, { en: 'Please', jp: 'Onegaishimasu' },
  ]},
  { title: '🍽️ At Restaurants', phrases: [
    { en: 'Table for 2, please', jp: 'Futari desu' }, { en: 'Menu, please', jp: 'Menyu onegaishimasu' }, { en: 'This one, please', jp: 'Kore onegaishimasu' },
    { en: 'Delicious!', jp: 'Oishii!' }, { en: 'Check, please', jp: 'Okaikei onegaishimasu' }, { en: "I'm allergic to...", jp: '... arerugi ga arimasu' },
    { en: 'No meat / vegetarian', jp: 'Niku nashi / bejitarian' }, { en: 'Water, please', jp: 'Omizu onegaishimasu' }, { en: 'Beer, please', jp: 'Biiru onegaishimasu' }, { en: 'Cheers!', jp: 'Kanpai!' },
  ]},
  { title: '🚃 Transport & Directions', phrases: [
    { en: 'Where is ...?', jp: '... wa doko desu ka?' }, { en: 'Train station', jp: 'Eki' }, { en: 'Which platform?', jp: 'Nanban sen desu ka?' },
    { en: 'Next stop', jp: 'Tsugi no eki' }, { en: 'Left / Right / Straight', jp: 'Hidari / Migi / Massugu' }, { en: 'How much time to ...?', jp: '... made dono kurai?' }, { en: 'Taxi to ..., please', jp: '... made onegaishimasu' },
  ]},
  { title: '🛍️ Shopping', phrases: [
    { en: 'How much is this?', jp: 'Ikura desu ka?' }, { en: 'Too expensive', jp: 'Takai desu' }, { en: 'Tax-free, please', jp: 'Menzei onegaishimasu' },
    { en: 'Do you have a bag?', jp: 'Fukuro arimasu ka?' }, { en: "I'll take this", jp: 'Kore kudasai' }, { en: 'Can I pay by card?', jp: 'Kaado de ii desu ka?' },
  ]},
  { title: '🏨 At the Hotel', phrases: [
    { en: 'I have a reservation', jp: 'Yoyaku shiteimasu' }, { en: 'Check-in / Check-out', jp: 'Chekkuin / Chekkuauto' },
    { en: 'Can I leave my luggage?', jp: 'Nimotsu wo azukete ii desu ka?' }, { en: 'WiFi password?', jp: 'WiFi no pasuwaado wa?' },
  ]},
  { title: '🆘 Emergency', phrases: [
    { en: 'Help!', jp: 'Tasukete!' }, { en: 'Call an ambulance', jp: 'Kyuukyuusha wo yonde' }, { en: 'Call the police', jp: 'Keisatsu wo yonde' },
    { en: "I'm lost", jp: 'Michi ni mayoimashita' }, { en: 'I need a doctor', jp: 'Isha ga hitsuyou desu' }, { en: 'I lost my passport', jp: 'Pasupooto wo nakushimashita' },
  ]},
  { title: '🔢 Numbers', phrases: [
    { en: '1 / 2 / 3 / 4 / 5', jp: 'Ichi / Ni / San / Yon / Go' }, { en: '6 / 7 / 8 / 9 / 10', jp: 'Roku / Nana / Hachi / Kyuu / Juu' }, { en: '100 / 1,000 / 10,000', jp: 'Hyaku / Sen / Man' },
  ]},
];

// --- Packing ---
export const PACKING_SECTIONS: PackingSection[] = [
  { title: '🧳 Essentials', items: [
    { text: 'Passport + copies (photo on phone)' }, { text: 'Travel insurance documents' }, { text: 'Credit/debit cards (Visa or Mastercard)' },
    { text: 'Cash — get yen before departure or at airport ATM' }, { text: 'Phone charger + portable battery' }, { text: 'Type A power adapter (US-style, 2 flat prongs)' },
    { text: 'eSIM or pocket WiFi reservation' }, { text: 'All booking confirmations saved offline' },
  ]},
  { title: '🗼 Tokyo & Kyoto — Early March (8–14°C)', items: [
    { text: 'Light jacket or layering fleece' }, { text: 'Long pants (jeans or chinos)' }, { text: "Comfortable walking shoes — you'll walk 15-25k steps/day" },
    { text: 'Small umbrella or rain jacket' }, { text: 'Scarf or light sweater for evenings' },
  ], note: 'Cherry blossom season starts late March in Tokyo — weather is pleasant but can be rainy.' },
  { title: '🏔️ Central Japan Mountains — Mid-March (3–10°C)', items: [
    { text: 'Warm jacket — Shirakawa-go and Takayama can be cold' }, { text: 'Thermal base layer (optional but recommended)' }, { text: 'Hiking shoes for Nakasendo Trail (3+ hr walk, some uphill)' },
    { text: 'Warm socks — onsen ryokans have tatami floors' }, { text: 'Small daypack for hikes' },
  ], note: 'Possible snow in Shirakawa-go in early-mid March. Roads are clear but bring layers.' },
  { title: '🌋 Kyushu — Late March (12–18°C)', items: [
    { text: 'Medium layers — warmer than central Japan' }, { text: 'Comfortable driving clothes' }, { text: 'Small towel for onsen visits (most provide, but handy)' }, { text: 'Rain gear — Kyushu can be rainy in spring' },
  ], note: 'Beppu & Yufuin are hot spring towns — you\'ll be in yukata (robes) a lot. Hotels provide them.' },
  { title: '🏖️ Okinawa / Ishigaki / Miyakojima — April (22–26°C)', items: [
    { text: 'Swimwear (2 sets)' }, { text: 'Reef shoes or water sandals — coral beaches are sharp' }, { text: 'Rashguard or light long-sleeve for sun & snorkeling' },
    { text: 'Sunscreen SPF 50+ (expensive in Japan — bring from home)' }, { text: 'Sunglasses & hat' }, { text: 'Shorts & light tops' }, { text: 'Snorkel mask (rentals available but own is nicer)' },
  ], note: 'Water temperature in April is ~23°C — warm enough to swim without a wetsuit.' },
  { title: '🎒 Good to Have', items: [
    { text: 'Packable tote bag for shopping / day trips' }, { text: 'Ziplock bags for trash (no public bins in Japan!)' }, { text: 'Handkerchief / small towel — many restrooms lack paper towels' },
    { text: 'Motion sickness pills (mountain roads in Kyushu)' }, { text: 'Basic medicine: ibuprofen, antihistamines, stomach relief' }, { text: 'Earplugs + eye mask for flights and ryokans' },
    { text: 'Nice outfit for special dinners (wagyu night, etc.)' }, { text: 'Luggage forwarding labels — ship your big bag via Yamato (hotel can help)' },
  ], note: 'Luggage forwarding (takkyubin) is amazing in Japan: send your suitcase to the next hotel for ~2,000 yen. Use it when switching between train and car segments!' },
];

/** Flat list of all packing item texts for store indexing (same order as sections) */
export const PACKING_ITEMS_FLAT = PACKING_SECTIONS.flatMap((s) => s.items.map((i) => i.text));

// --- Checklist (categories + flat list for store) ---
export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  { category: 'Documents & Essentials', items: ['Passport (valid)', 'Travel insurance details', 'International driving permit (for rental days)'] },
  { category: 'Transport', items: ['Buy / load Suica card', 'Shinkansen reservation: Tokyo → Kyoto (Day 5)', 'Shinkansen reservation: Nagoya → Fukuoka (Day 16)', 'Car rental confirmation + insurance coverage'] },
  { category: 'Tickets & Reservations', items: ['Universal Studios tickets downloaded offline', 'TeamLab Planets tickets', 'Takachiho Gorge boat tour (book on Mar 16!)', 'Takachiho Kagura night performance (20:00)', 'Hotel confirmations saved offline', 'Restaurant reservations in Kyoto & Osaka'] },
  { category: 'Tech & Connectivity', items: ['Portable WiFi / eSIM ready before landing', 'Plug adapter (Japan Type A/B, 100V)', 'Power bank charged'] },
  { category: 'Money & Packing', items: ['Cash (JPY) for rural areas: Takayama, Kiso, Beppu', 'Small towel for onsens / foot baths', "Read up on onsen rules & etiquette (Beppu stay)"] },
];

export const CHECKLIST_ITEMS_FLAT = CHECKLIST_CATEGORIES.flatMap((c) => c.items);

// --- To Book ---
export const TODO_ITEMS: TodoItem[] = [
  { title: 'Shinkansen: Tokyo → Kyoto', detail: 'Day 5 (Mar 11). Shinjuku → Shinagawa → Kyoto. Reserve seats on the Tokaido Shinkansen. Can book via SmartEX app or at JR station.', when: 'Book soon — cherry blossom season = busy', urgency: 'high' },
  { title: 'Shinkansen: Nagoya → Fukuoka (Hakata)', detail: 'Day 16 (Mar 22). After returning the car in Nagoya. ~3.5 hours on Tokaido-Sanyo Shinkansen.', when: 'Book soon', urgency: 'high' },
  { title: 'Takachiho Gorge Boat Tour', detail: 'Day 24 (Mar 30). Must be booked on Mar 16 (exactly 2 weeks before). Slots sell out within minutes — set an alarm!', when: 'Book on Mar 16 at midnight sharp', urgency: 'high' },
  { title: 'Takachiho Kagura Night Performance ✅', detail: 'Day 23 (Mar 29) at 20:00 at Takachiho Shrine. BOOKED! ~1,000 yen at the door.', when: 'Booked — arrive 15 min early', urgency: 'low', booked: true },
  { title: 'Haneda Airport Taxi (Arrival Night)', detail: 'Day 1 (Mar 7). Landing at 23:00 — trains stop around midnight. Pre-book a taxi or airport shuttle to Shinjuku.', when: 'Book 1-2 weeks before', urgency: 'med' },
  { title: 'Restaurant Reservations — Kyoto & Osaka', detail: 'Your plan mentions 2-3 restaurants. Kyoto wagyu dinner (Day 6), Osaka dining. Popular spots book out weeks ahead, especially during cherry blossom season.', when: 'Book ASAP — sakura season fills up', urgency: 'high' },
  { title: 'Shibuya Sky Observation Deck', detail: 'Day 3 (Mar 9). Timed entry — sells out on busy days. Book online in advance for a specific time slot.', when: 'Book 1-2 weeks before', urgency: 'med' },
  { title: 'Fushimi Inari — No booking needed', detail: 'Day 9 (Mar 15). Free and open 24/7. Go early morning or at dusk to avoid the worst crowds. No reservation required.', when: 'No booking — just go early', urgency: 'low' },
  { title: 'Arashiyama Monkey Park', detail: 'Day 6 (Mar 12). No reservation needed, but check opening hours. It\'s a 20-min uphill walk — plan accordingly.', when: 'No booking needed', urgency: 'low' },
  { title: 'Mt. Fuji Five Lakes Day Trip Transport', detail: 'Day 36 (Apr 11). Highway buses from Shinjuku to Kawaguchiko sell out in cherry blossom season. Book return bus too. Alternative: rent a car or take the Fuji Excursion train.', when: 'Book 2+ weeks ahead', urgency: 'high' },
  { title: 'Snorkeling / Diving Tours in Ishigaki', detail: 'Days 29-31 (Apr 4-6). Kabira Bay glass-bottom boats, snorkeling tours to Manta Point, Taketomi/Iriomote day trips — popular operators book up.', when: 'Book 1-2 weeks before', urgency: 'med' },
  { title: 'Hells of Beppu — Combo Ticket', detail: 'Day 20 (Mar 26). Buy the 7-hells combo ticket. Can be purchased on-site, but check if there\'s an online discount on Klook.', when: 'Can buy on arrival', urgency: 'low' },
  { title: 'Suica / IC Card', detail: 'Essential for all train/bus travel in cities. Get a physical Suica at Haneda airport or add a digital Suica to Apple Wallet before landing.', when: 'Set up before landing', urgency: 'med' },
];

// --- Ideas (What am I missing) ---
export const IDEA_ITEMS: IdeaItem[] = [
  { region: 'Tokyo', regionColor: '#DC2626', title: 'Asakusa & Senso-ji Temple', description: "Tokyo's most iconic temple, Nakamise shopping street, and the Kaminarimon gate. You have 4 days in Tokyo at the start but it's not in your plan. Perfect for a half-day, combine with a walk along the Sumida River.", fit: 'Fits Day 2, 3, or 4' },
  { region: 'Tokyo', regionColor: '#DC2626', title: 'Tsukiji Outer Market', description: 'The original fish market moved to Toyosu, but the outer market is still a must-visit for fresh sushi breakfast, tamagoyaki, and street food. 1-2 hours in the morning.', fit: 'Fits any Tokyo morning (Day 2-4 or 37)' },
  { region: 'Tokyo (Return)', regionColor: '#DC2626', title: 'Akihabara', description: "Electric Town — anime, manga, retro games, maid cafes. Even if you're not into anime, the energy is worth experiencing. Easy half-day.", fit: 'Fits Day 37 (free Tokyo day)' },
  { region: 'Kyoto', regionColor: '#7C3AED', title: 'Fushimi Inari — Decide Yes or No', description: "It's marked with \"?\" on Day 9. The thousands of torii gates are one of Japan's most photographed sights. Best at sunrise or late afternoon. If doing it, commit to walking at least halfway up the mountain (30-45 min). It's technically in Kyoto, so Day 8 evening or Day 9 morning makes more sense than leaving it to the Osaka travel day.", fit: 'Move to Day 8 afternoon/evening?' },
  { region: 'Osaka', regionColor: '#EA580C', title: 'Dotonbori & Street Food', description: "Day 11 is a free day but has no plan. Dotonbori is THE Osaka experience — takoyaki, okonomiyaki, glico sign, canal walk. Don't miss it. Combine with Shinsekai for kushikatsu.", fit: 'Day 11 (free Osaka day)' },
  { region: 'Osaka', regionColor: '#EA580C', title: 'Osaka Castle', description: "Even if you don't go inside, the castle grounds and surrounding park are stunning — especially during cherry blossom season (mid-March could be early bloom). The view from the top floor is great.", fit: 'Day 11 morning' },
  { region: 'Central Japan', regionColor: '#059669', title: 'Takayama Old Town at Night', description: "You're staying in Takayama but your plan jumps straight to the morning market next day. The Sanmachi Suji historic district is atmospheric at night — quiet streets, sake breweries, warm lantern light. Walk it the evening you arrive (Day 12).", fit: 'Day 12 evening' },
  { region: 'Okinawa', regionColor: '#0891B2', title: 'Taketomi Island Day Trip (from Ishigaki)', description: 'Only a 10-minute ferry from Ishigaki. Rent a bicycle and ride around the entire island in 1-2 hours. Traditional Okinawan red-tiled houses, star sand beaches, and water buffalo cart rides. A must-do side trip.', fit: 'Day 29 or 30 (half-day)' },
  { region: 'Okinawa', regionColor: '#0891B2', title: 'Kabira Bay Glass-Bottom Boat', description: 'The most beautiful bay in Ishigaki with turquoise water and coral reefs. Swimming is actually prohibited here, so the glass-bottom boat is the way to see the coral. ~30 min ride.', fit: 'Any Ishigaki day' },
  { region: 'Tokyo (Return)', regionColor: '#E11D48', title: 'Cherry Blossoms! (Early April)', description: "You return to Tokyo around Apr 10-14 — peak cherry blossom season. Don't miss hanami at Ueno Park, Chidorigafuchi moat (boat rental under the blossoms), or Meguro River. This is a once-in-a-lifetime timing!", fit: 'Days 35-39 — plan hanami!' },
];

// --- Iran popup (easter egg) ---
export const IRAN_POPUP = {
  emoji: '🚀🇮🇷',
  title: 'Pre-Flight Security Check',
  subtitle: 'Before accessing your Japan itinerary, please confirm:',
  question: 'Will Iran shoot?',
  buttons: ['No', 'Absolutely No'],
  footer: '* This security assessment is 100% accurate and legally binding',
};

export { TRIP_DAYS } from './tripDays';
