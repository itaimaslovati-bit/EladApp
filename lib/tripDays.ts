import type { TripDay } from './types';

const H = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const TRIP_DAYS: TripDay[] = [
  {
    dayNumber: 1,
    dayLabel: '1',
    title: 'Landing Day',
    date: 'Sat, Mar 7 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Tokyo Haneda Airport Japan'),
    sections: [
      {
        title: 'Travel',
        items: [
          { text: 'Arrive at Tokyo Haneda at 23:00', tip: 'Last trains stop ~midnight. Pre-book a taxi or use JapanTaxi app. Airport taxi stands have flat-rate options to Shinjuku (~6,000-8,000 yen, 40 min).', mapsLink: H('Tokyo Haneda Airport Japan') },
          { text: 'Book a taxi in advance — trains/buses stop around midnight' },
        ],
      },
      {
        title: 'Hotel',
        items: [{ text: 'Hotel Century Southern Tower, Shinjuku', mapsLink: H('Hotel Century Southern Tower Shinjuku Tokyo') }],
      },
    ],
  },
  {
    dayNumber: 2,
    dayLabel: '2',
    title: 'Shinjuku',
    date: 'Sun, Mar 8 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Shinjuku Tokyo Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Shinjuku Gyoen National Garden', mapsLink: H('Shinjuku Gyoen National Garden Tokyo') },
          { text: 'Shopping in Shinjuku', mapsLink: H('Shinjuku Tokyo Japan') },
          { text: 'Omoide Yokocho (Memory Lane)', tip: 'Tiny alley — gets very crowded after 19:00. Go early (17:00-18:00) for a seat. Most stalls are cash only. Some charge a seating fee (~300 yen).', mapsLink: H('Omoide Yokocho Shinjuku Tokyo') },
          { text: 'Kabukicho', mapsLink: H('Kabukicho Shinjuku Tokyo') },
          { text: 'Shinjuku Government Building — observation deck & light show', mapsLink: H('Tokyo Metropolitan Government Building') },
        ],
      },
    ],
  },
  {
    dayNumber: 3,
    dayLabel: '3',
    title: 'Harajuku & Shibuya',
    date: 'Mon, Mar 9 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Harajuku Shibuya Tokyo Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Meiji Shrine', mapsLink: H('Meiji Shrine Tokyo Japan') },
          { text: 'Harajuku — Takeshita Street', mapsLink: H('Takeshita Street Harajuku Tokyo') },
          { text: 'Shibuya Crossing', mapsLink: H('Shibuya Crossing Tokyo Japan') },
          { text: 'Shibuya Sky (?)', tip: 'Book tickets online in advance — sells out on weekends. Best at sunset (around 17:30 in March). ~2,000 yen. Rooftop is open-air so dress warm!', mapsLink: H('Shibuya Sky Tokyo Japan') },
          { text: 'Evening in Shibuya or back to Shinjuku' },
        ],
      },
    ],
  },
  {
    dayNumber: 4,
    dayLabel: '4',
    title: 'Shimokitazawa & Roppongi',
    date: 'Tue, Mar 10 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Roppongi Tokyo Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Shimokitazawa neighborhood', mapsLink: H('Shimokitazawa Tokyo Japan') },
          { text: 'Roppongi + Roppongi Hills', tip: 'Last train from Roppongi to Shinjuku: ~00:10 (Oedo Line to Shinjuku). Roppongi Hills observation deck closes at 23:00 (last entry 22:30).', mapsLink: H('Roppongi Hills Tokyo Japan') },
          { text: 'Shinjuku Government Building & light show (if not done on Day 2)', mapsLink: H('Tokyo Metropolitan Government Building') },
        ],
      },
      {
        title: 'Dinner',
        items: [{ text: '🍽️ 19:30 — Gyopao Gyoza Roppongi (reserved)', mapsLink: H('Gyopao Gyoza Roppongi Tokyo') }],
      },
    ],
  },
  {
    dayNumber: 5,
    dayLabel: '5',
    title: 'Travel to Kyoto',
    date: 'Wed, Mar 11 · Shinkansen',
    region: 'kyoto',
    hotel: { name: 'Cross Hotel Kyoto', emoji: '🏨' },
    mapsLink: H('Kyoto Station Japan'),
    sections: [
      {
        title: 'Travel',
        items: [{ text: 'Shinjuku → Shinagawa → Kyoto by Shinkansen', tip: 'Take JR Chuo to Shinagawa (~18 min, Suica OK). Then Nozomi Shinkansen to Kyoto (~2h10, ~13,320 yen). Reserve seats — sit on RIGHT side (D/E) for Mt. Fuji views!', mapsLink: H('Kyoto Station Japan') }],
      },
      {
        title: 'Attractions',
        items: [
          { text: 'Nishiki Market', mapsLink: H('Nishiki Market Kyoto Japan') },
          { text: 'Gion district — river walk', mapsLink: H('Gion Kyoto Japan') },
          { text: 'Pontocho Alley', mapsLink: H('Pontocho Kyoto Japan') },
          { text: 'Yasaka Shrine', mapsLink: H('Yasaka Shrine Kyoto Japan') },
        ],
      },
      {
        title: 'Hotel',
        items: [{ text: 'Cross Hotel Kyoto — Nakagyo-ku Daikoku-cho 71-1', mapsLink: H('Cross Hotel Kyoto Japan') }],
      },
    ],
  },
  {
    dayNumber: 6,
    dayLabel: '6',
    title: 'Arashiyama & Kinkaku-ji',
    date: 'Thu, Mar 12 · Kyoto',
    region: 'kyoto',
    mapsLink: H('Arashiyama Bamboo Grove Kyoto Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Arashiyama bamboo grove', tip: 'Go at sunrise or very early morning (before 8:00) to avoid crowds. By 10:00 it gets packed. The walk through the grove takes only 10-15 min.', mapsLink: H('Arashiyama Bamboo Grove Kyoto') },
          { text: 'Kinkaku-ji (Golden Pavilion)', mapsLink: H('Kinkaku-ji Kyoto Japan') },
          { text: 'Ryoan-ji', mapsLink: H('Ryoan-ji Kyoto Japan') },
          { text: 'Monkey Park (?)', mapsLink: H('Iwatayama Monkey Park Kyoto') },
          { text: 'Wagyu dinner in the evening' },
        ],
      },
    ],
  },
  {
    dayNumber: 7,
    dayLabel: '7',
    title: 'Nara Day Trip',
    date: 'Fri, Mar 13 · Kyoto',
    region: 'kyoto',
    mapsLink: H('Nara Park Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Nara Deer Park', tip: 'Buy deer crackers (shika senbei, ~200 yen) from official vendors only. Deer can be pushy! Hide the crackers until ready. Bow to a deer and it bows back.', mapsLink: H('Nara Park Japan') },
          { text: 'Todai-ji Temple', mapsLink: H('Todai-ji Temple Nara Japan') },
          { text: 'Evening around Imperial Palace area, Kyoto', mapsLink: H('Kyoto Imperial Palace Japan') },
        ],
      },
    ],
  },
  {
    dayNumber: 8,
    dayLabel: '8',
    title: "Philosopher's Path & Kiyomizu-dera",
    date: 'Sat, Mar 14 · Kyoto',
    region: 'kyoto',
    mapsLink: H('Kiyomizu-dera Temple Kyoto Japan'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: "Philosopher's Path", mapsLink: H('Philosophers Path Kyoto Japan') },
          { text: 'Kiyomizu-dera', mapsLink: H('Kiyomizu-dera Kyoto Japan') },
          { text: 'Sannen-zaka & Ninen-zaka streets', mapsLink: H('Sannen-zaka Kyoto Japan') },
          { text: 'Maruyama Park', mapsLink: H('Maruyama Park Kyoto Japan') },
          { text: 'Yasaka Pagoda & Shrine', mapsLink: H('Yasaka Pagoda Kyoto Japan') },
          { text: 'Ishibe Alley', mapsLink: H('Ishibe Koji Kyoto Japan') },
        ],
      },
    ],
  },
  {
    dayNumber: 9,
    dayLabel: '9',
    title: 'Travel to Osaka',
    date: 'Sun, Mar 15 · Osaka',
    region: 'osaka',
    hotel: { name: 'Hotel Granvia Osaka', emoji: '🏨' },
    mapsLink: H('Osaka Station Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'Train from Kyoto to Osaka', mapsLink: H('Osaka Station Japan') }] },
      {
        title: 'Attractions',
        items: [
          { text: 'Nishiki Market (?)', mapsLink: H('Nishiki Market Kyoto Japan') },
          { text: 'Fushimi Inari (?)', tip: 'Free and open 24/7. Go at dawn or dusk to avoid worst crowds. The full loop to the summit takes ~2-3 hours. Most people turn back at the viewpoint (~45 min up).', mapsLink: H('Fushimi Inari Shrine Kyoto Japan') },
        ],
      },
      { title: 'Hotel', items: [{ text: 'Hotel Granvia Osaka (JR Hotel Group)', mapsLink: H('Hotel Granvia Osaka Japan') }] },
    ],
  },
  {
    dayNumber: 10,
    dayLabel: '10',
    title: 'Universal Studios',
    date: 'Mon, Mar 16 · Osaka',
    region: 'osaka',
    mapsLink: H('Universal Studios Japan Osaka'),
    sections: [
      {
        title: 'Attractions',
        items: [
          { text: 'Full day at Universal Studios Japan', tip: 'From Hotel Granvia: walk to JR Osaka Station (hotel is inside the station!). Take JR Yumesaki Line direct to Universal City (~11 min, 180 yen). Gates open 8:30 or 9:00 — arrive 30 min early for popular rides. Download the USJ app for wait times.', mapsLink: H('Universal Studios Japan Osaka') },
          { text: 'Tickets via Klook (1,721 NIS)' },
        ],
      },
    ],
  },
  {
    dayNumber: 11,
    dayLabel: '11',
    title: 'Osaka Free Day',
    date: 'Tue, Mar 17 · Osaka',
    region: 'osaka',
    mapsLink: H('Dotonbori Osaka Japan'),
    sections: [
      {
        title: 'Ideas',
        items: [
          { text: 'Dotonbori', mapsLink: H('Dotonbori Osaka Japan') },
          { text: 'Osaka Castle', mapsLink: H('Osaka Castle Japan') },
          { text: 'Shinsekai', mapsLink: H('Shinsekai Osaka Japan') },
          { text: 'Kuromon Market', mapsLink: H('Kuromon Market Osaka Japan') },
          { text: 'Street food tour — plan as you go!' },
        ],
      },
    ],
  },
  {
    dayNumber: 12,
    dayLabel: '12',
    title: 'Shirakawa-go → Takayama',
    date: 'Wed, Mar 18 · Pick up car in Nagoya',
    region: 'rural',
    hotel: { name: 'Takayama hotel', emoji: '🏨' },
    mapsLink: H('Shirakawa-go Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'Train to Nagoya, pick up rental car (Budget, via Klook — $365)', mapsLink: H('Nagoya Station Japan') }, { text: 'Drive to Shirakawa-go, then on to Takayama' }] },
      { title: 'Attractions', items: [{ text: 'Shirakawa-go historic village (UNESCO)', tip: 'Can still be cold/snowy in mid-March (3-8°C). Dress in warm layers. The village observation deck (Shiroyama Viewpoint) is a 15-min uphill walk — best for photos.', mapsLink: H('Shirakawa-go Japan') }, { text: 'Arrive Takayama evening', mapsLink: H('Takayama Japan') }] },
      { title: 'Hotel', items: [{ text: 'Hotel around Takayama (Ascend Collection)', mapsLink: H('Takayama Japan') }] },
    ],
  },
  {
    dayNumber: 13,
    dayLabel: '13',
    title: 'Takayama → Matsumoto',
    date: 'Thu, Mar 19',
    region: 'rural',
    mapsLink: H('Takayama Old Town Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'Takayama morning market (Shimosannomachi + Jinya-mae)', mapsLink: H('Takayama Morning Market Japan') },
        { text: 'Hirayu Onsen (45 min drive)', tip: 'Mountain onsen at ~1,300m elevation. Bring a small towel (or buy one for ~200 yen). Remember: wash before entering the bath, no swimwear, tattoos may be an issue at some places.', mapsLink: H('Hirayu Onsen Japan') },
        { text: 'Taisho Pond', mapsLink: H('Taisho Pond Kamikochi Japan') },
        { text: 'Drive to Matsumoto', mapsLink: H('Matsumoto Japan') },
      ]},
      { title: 'Hotel', items: [{ text: 'Onyado Nono Matsumoto Hot Spring', mapsLink: H('Onyado Nono Matsumoto Japan') }] },
    ],
  },
  {
    dayNumber: 14,
    dayLabel: '14',
    title: 'Kiso Valley · Naraijuku',
    date: 'Fri, Mar 20',
    region: 'rural',
    mapsLink: H('Narai-juku Nagano Japan'),
    sections: [
      { title: 'Attractions', items: [{ text: 'Matsumoto Castle', mapsLink: H('Matsumoto Castle Japan') }, { text: 'Drive through Kiso Valley', mapsLink: H('Kiso Valley Japan') }, { text: 'Naraijuku post town', mapsLink: H('Narai-juku Nagano Japan') }] },
      { title: 'Hotel', items: [{ text: 'Nukumorino-yado Komanoyu', mapsLink: H('Nukumorino-yado Komanoyu Japan') }] },
    ],
  },
  {
    dayNumber: 15,
    dayLabel: '15',
    title: 'Nakasendo Trail',
    date: 'Sat, Mar 21 · Tsumago ⇄ Magome',
    region: 'rural',
    hotel: { name: 'Enakyo Onsen Hotel', emoji: '♨️' },
    sections: [
      { title: 'Attractions', items: [
        { text: 'Nakasendo Trail: Tsumago ⇄ Magome (3–3.5 hr hike)', tip: 'Moderate difficulty, mostly paved/gravel. Start from Magome (uphill first, then downhill) or Tsumago (opposite). There is a luggage forwarding service between the two towns (~500 yen/bag, arrange at your inn by 8:00 AM).', mapsLink: H('Tsumago Post Town Japan') },
        { text: 'Tsumago-juku', mapsLink: H('Tsumago-juku Japan') },
        { text: 'Magome-juku', mapsLink: H('Magome-juku Japan') },
      ]},
      { title: 'Hotel', items: [{ text: 'Enakyo Onsen Hotel', mapsLink: H('Enakyo Grand Hotel Japan') }] },
    ],
  },
  {
    dayNumber: 16,
    dayLabel: '16',
    title: 'Return Car → Shinkansen to Fukuoka',
    date: 'Sun, Mar 22 · Car drop-off Nagoya',
    region: 'kyushu',
    hotel: { name: 'Richmond Hotel Fukuoka Tenjin', emoji: '🏨' },
    mapsLink: H('Hakata Station Fukuoka Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'Return rental car in Nagoya', mapsLink: H('Nagoya Station Japan') }, { text: 'Shinkansen from Nagoya to Fukuoka (Hakata)', mapsLink: H('Hakata Station Fukuoka Japan') }] },
      { title: 'Hotel', items: [{ text: 'Richmond Hotel Fukuoka Tenjin', mapsLink: H('Richmond Hotel Fukuoka Tenjin Japan') }] },
    ],
  },
  {
    dayNumber: 17,
    dayLabel: '17',
    title: 'Fukuoka City',
    date: 'Mon, Mar 23',
    region: 'kyushu',
    sections: [
      { title: 'Attractions', items: [
        { text: 'Canal City Hakata', mapsLink: H('Canal City Hakata Fukuoka Japan') },
        { text: 'Dinner at Tenjin / Hakata area', mapsLink: H('Tenjin Fukuoka Japan') },
        { text: 'Try Hakata ramen!', mapsLink: H('Hakata Ramen Fukuoka Japan') },
      ]},
    ],
  },
  {
    dayNumber: 18,
    dayLabel: '18',
    title: 'Nokonoshima / Uminonakamichi',
    date: 'Tue, Mar 24 · Fukuoka',
    region: 'kyushu',
    mapsLink: H('Nokonoshima Island Park Fukuoka Japan'),
    sections: [
      { title: 'Attractions', items: [{ text: 'Nokonoshima Island Park', mapsLink: H('Nokonoshima Island Park Fukuoka Japan') }, { text: 'Uminonakamichi Seaside Park', mapsLink: H('Uminonakamichi Seaside Park Fukuoka Japan') }] },
    ],
  },
  {
    dayNumber: 19,
    dayLabel: '19',
    title: 'Kitsuki → Beppu',
    date: 'Wed, Mar 25',
    region: 'kyushu',
    hotel: { name: 'Nihonryokan Utsuwa Beppu Kannawa', emoji: '♨️' },
    mapsLink: H('Kitsuki Castle Town Oita Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'Drive to Kitsuki', mapsLink: H('Kitsuki Oita Japan') }] },
      { title: 'Attractions', items: [
        { text: 'Kitsuki Samurai district', mapsLink: H('Kitsuki Castle Town Oita Japan') },
        { text: 'Suya-no-saka & Shioami-zaka slopes', mapsLink: H('Kitsuki Japan') },
        { text: 'Kitsuki Castle', mapsLink: H('Kitsuki Castle Japan') },
        { text: 'Old town coffee & lunch' },
        { text: 'Drive to Beppu', mapsLink: H('Beppu Japan') },
      ]},
      { title: 'Dinner', items: [{ text: 'Jigoku Mushi Kobo Kannawa (hell-steamed cooking)', tip: 'Buy raw ingredients at the market next door, then steam them yourself over natural hot spring vents. Very fun and unique. Can get busy — arrive before 12:00 for lunch.', mapsLink: H('Jigoku Mushi Kobo Kannawa Beppu') }] },
      { title: 'Hotel', items: [{ text: 'Nihonryokan Utsuwa Beppu Kannawa', mapsLink: H('Nihonryokan Utsuwa Beppu Japan') }] },
    ],
  },
  {
    dayNumber: 20,
    dayLabel: '20',
    title: 'Hells of Beppu',
    date: 'Thu, Mar 26 · Beppu',
    region: 'kyushu',
    mapsLink: H('Beppu Jigoku Hells Japan'),
    sections: [
      { title: 'Attractions', items: [{ text: 'Hells of Beppu (Jigoku Meguri)', mapsLink: H('Beppu Jigoku Hells Japan') }] },
    ],
  },
  {
    dayNumber: 21,
    dayLabel: '21',
    title: 'Beppu Onsen Day',
    date: 'Fri, Mar 27 · Beppu',
    region: 'kyushu',
    sections: [
      { title: 'Attractions', items: [
        { text: 'Okamotoya Jigokumushi Pudding', mapsLink: H('Okamotoya Jigokumushi Pudding Beppu') },
        { text: 'Mt. Tsurumi Ropeway (?)', mapsLink: H('Mount Tsurumi Ropeway Beppu') },
        { text: 'Evening at Yufu / Wonder Beppu', mapsLink: H('Beppu Japan') },
        { text: 'Dinner at Tiny Izakaya' },
      ]},
    ],
  },
  {
    dayNumber: 22,
    dayLabel: '22',
    title: 'Yufuin · Glamping',
    date: 'Sat, Mar 28',
    region: 'kyushu',
    hotel: { name: 'Sense of Wonder Glamping', emoji: '⛺' },
    mapsLink: H('Yufuin Floral Village Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'Yufuin Floral Village', tip: 'Small English-village themed area — cute but can be touristy. Better to explore Yunotsubo Street (the main shopping street) and the quiet back alleys. Lake Kinrin is magical at dawn with morning mist.', mapsLink: H('Yufuin Floral Village Japan') },
        { text: 'Lake Kinrin', mapsLink: H('Lake Kinrin Yufuin Japan') },
        { text: 'Yufuin town stroll', mapsLink: H('Yufuin Japan') },
      ]},
      { title: 'Hotel', items: [{ text: 'Sense of Wonder Glamping', mapsLink: H('Sense of Wonder Yufuin Japan') }] },
    ],
  },
  {
    dayNumber: 23,
    dayLabel: '23',
    title: 'Takachiho',
    date: 'Sun, Mar 29 · 🎭 Kagura 20:00 (booked!)',
    region: 'kyushu',
    hotel: { name: 'Solest Takachiho Hotel', emoji: '🏨' },
    sections: [
      { title: 'Travel', items: [{ text: 'Drive via Kokonoe Bridge & Yamanami Highway (scenic route)', mapsLink: H('Kokonoe Yume Grand Suspension Bridge Japan') }] },
      { title: 'Attractions', items: [
        { text: 'Kamishikimi Kumanoimasu Shrine', mapsLink: H('Kamishikimi Kumanoimasu Shrine Japan') },
        { text: 'Takachiho Shrine — evening Kagura performance at 20:00 (booked!)', tip: 'You have this booked! Arrive 15-20 min early to get a good seat. Performance lasts ~1 hour. ~1,000 yen at the door. Deeply spiritual experience — no flash photography.', mapsLink: H('Takachiho Shrine Miyazaki Japan') },
      ]},
      { title: 'Hotel', items: [{ text: 'Solest Takachiho Hotel', mapsLink: H('Solest Takachiho Japan') }] },
    ],
  },
  {
    dayNumber: 24,
    dayLabel: '24',
    title: 'Takachiho Gorge → Aso',
    date: 'Mon, Mar 30',
    region: 'aso',
    hotel: { name: 'Fairfield by Marriott Kumamoto Aso', emoji: '🏨' },
    mapsLink: H('Takachiho Gorge Miyazaki Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'Takachiho Gorge boat tour (book on Mar 16!)', tip: 'Boats operate 8:30-17:00. Book online as early as possible (opens 2 weeks before). ~5,100 yen for 30 min. Morning light is best for photos of the waterfall. Can get cancelled in heavy rain.', mapsLink: H('Takachiho Gorge Miyazaki Japan') },
        { text: 'Amanoiwato Shrine', mapsLink: H('Amanoiwato Shrine Takachiho Japan') },
        { text: 'Daikanbo Viewpoint', mapsLink: H('Daikanbo Viewpoint Aso Japan') },
        { text: 'Drive to Fairfield hotel' },
      ]},
      { title: 'Hotel', items: [{ text: 'Fairfield by Marriott Kumamoto Aso', mapsLink: H('Fairfield by Marriott Kumamoto Aso Japan') }] },
    ],
  },
  {
    dayNumber: 25,
    dayLabel: '25',
    title: 'Kusasenri Observatory',
    date: 'Tue, Mar 31 · Aso',
    region: 'aso',
    mapsLink: H('Kusasenri Aso Kumamoto Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'Kusasenri Observatory — easy 1-hour walk through grasslands', mapsLink: H('Kusasenri Aso Kumamoto Japan') },
        { text: 'Explore Aso area at your pace', mapsLink: H('Mount Aso Kumamoto Japan') },
      ]},
    ],
  },
  {
    dayNumber: 26,
    dayLabel: '26-27',
    title: 'Aso Free Days',
    date: 'Wed-Thu, Apr 1-2 · Aso-Kujo National Park',
    region: 'aso',
    mapsLink: H('Mount Aso Kumamoto Japan'),
    sections: [
      { title: 'Ideas', items: [
        { text: 'Rest & explore' },
        { text: 'Aso volcano crater (if open)', mapsLink: H('Mount Aso Crater Kumamoto Japan') },
        { text: 'Hot springs & scenic drives', mapsLink: H('Aso Onsen Kumamoto Japan') },
        { text: 'Local onsen towns' },
        { text: 'Flexible days before Okinawa' },
      ]},
    ],
  },
  {
    dayNumber: 28,
    dayLabel: '28',
    title: 'Fly to Ishigaki',
    date: 'Fri, Apr 3 · Peach 12:20 from Fukuoka',
    region: 'okinawa',
    hotel: { name: 'Seven x Seven Ishigaki', emoji: '🏨' },
    mapsLink: H('Ishigaki Island Okinawa Japan'),
    sections: [
      { title: 'Travel', items: [
        { text: 'Drive back towards Fukuoka / drop car', mapsLink: H('Fukuoka Airport Japan') },
        { text: 'Peach Airlines flight at 12:20 to Ishigaki', tip: 'Peach is a budget airline! Baggage is NOT included — pre-purchase checked bags online (cheaper than at airport). Arrive 1.5h before departure. Bring snacks, no free food onboard.', mapsLink: H('Ishigaki Airport Okinawa Japan') },
        { text: 'Pick up rental car (Nissan, ~720 NIS)' },
      ]},
      { title: 'Hotel', items: [{ text: 'Seven x Seven Ishigaki', mapsLink: H('Seven x Seven Ishigaki Japan') }] },
    ],
  },
  {
    dayNumber: 29,
    dayLabel: '29-31',
    title: 'Ishigaki Island',
    date: 'Sat-Mon, Apr 4-6 · Beach & island life',
    region: 'okinawa',
    mapsLink: H('Kabira Bay Ishigaki Japan'),
    sections: [
      { title: 'Ideas', items: [
        { text: 'Snorkeling' },
        { text: 'Kabira Bay', mapsLink: H('Kabira Bay Ishigaki Japan') },
        { text: 'Tamatorizaki Observatory', mapsLink: H('Tamatorizaki Observatory Ishigaki Japan') },
        { text: 'Mangrove kayaking', mapsLink: H('Miyara River Mangrove Ishigaki Japan') },
        { text: 'Beach time' },
        { text: 'Island-hop to Taketomi or Iriomote', mapsLink: H('Taketomi Island Okinawa Japan') },
      ]},
    ],
  },
  {
    dayNumber: 32,
    dayLabel: '32',
    title: 'Fly to Miyakojima',
    date: 'Tue, Apr 7 · ANA 8:30',
    region: 'okinawa',
    hotel: { name: 'Tokyu Hotel Resort, Miyakojima', emoji: '🏨' },
    mapsLink: H('Miyakojima Okinawa Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'ANA flight at 8:30 to Miyakojima', mapsLink: H('Miyakojima Airport Okinawa Japan') }, { text: 'Pick up car (Budget, via Klook — $261)' }] },
      { title: 'Hotel', items: [{ text: 'Tokyu Hotel Resort, Miyakojima', mapsLink: H('Miyakojima Tokyu Hotel Resort Japan') }] },
    ],
  },
  {
    dayNumber: 33,
    dayLabel: '33-34',
    title: 'Miyakojima',
    date: 'Wed-Thu, Apr 8-9 · Beach paradise',
    region: 'okinawa',
    mapsLink: H('Yonaha Maehama Beach Miyakojima Japan'),
    sections: [
      { title: 'Ideas', items: [
        { text: 'Yonaha Maehama Beach', mapsLink: H('Yonaha Maehama Beach Miyakojima Japan') },
        { text: 'Irabu Bridge drive', mapsLink: H('Irabu Bridge Miyakojima Japan') },
        { text: 'Shimojishima', mapsLink: H('Shimojishima Okinawa Japan') },
        { text: 'Snorkeling at Yoshino Beach', mapsLink: H('Yoshino Beach Miyakojima Japan') },
        { text: 'Sunsets' },
      ]},
    ],
  },
  {
    dayNumber: 35,
    dayLabel: '35',
    title: 'Fly to Tokyo · Ginza',
    date: 'Fri, Apr 10 · JAL 14:35',
    region: 'tokyo',
    hotel: { name: 'The Royal Park Canvas Ginza Corridor', emoji: '🏨' },
    mapsLink: H('Ginza Tokyo Japan'),
    sections: [
      { title: 'Travel', items: [{ text: 'JAL flight at 14:35 back to Tokyo (via trip.com — $270.80)', mapsLink: H('Haneda Airport Tokyo Japan') }] },
      { title: 'Hotel', items: [{ text: 'The Royal Park Canvas Ginza Corridor', mapsLink: H('Royal Park Canvas Ginza Corridor Tokyo') }] },
    ],
  },
  {
    dayNumber: 36,
    dayLabel: '36',
    title: 'Mt. Fuji Five Lakes Day Trip',
    date: 'Sat, Apr 11 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Lake Kawaguchi Mount Fuji Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'Day trip to Fuji Five Lakes area', tip: 'Mt. Fuji is best visible in the morning (clouds build up by afternoon). Take the earliest Fuji Excursion train from Shinjuku (~7:30). Book reserved seats the day before — sells out on weekends!', mapsLink: H('Lake Kawaguchi Japan') },
        { text: 'Kawaguchiko', mapsLink: H('Kawaguchiko Station Japan') },
        { text: 'Views of Mt. Fuji', mapsLink: H('Chureito Pagoda Fujiyoshida Japan') },
        { text: 'Lakeside walks' },
      ]},
    ],
  },
  {
    dayNumber: 37,
    dayLabel: '37',
    title: 'Tokyo',
    date: 'Sun, Apr 12 · Tokyo',
    region: 'tokyo',
    mapsLink: H('Akihabara Tokyo Japan'),
    sections: [
      { title: 'Ideas', items: [
        { text: 'Akihabara', mapsLink: H('Akihabara Tokyo Japan') },
        { text: 'Asakusa (Senso-ji)', mapsLink: H('Senso-ji Temple Tokyo Japan') },
        { text: 'Ueno', mapsLink: H('Ueno Park Tokyo Japan') },
        { text: 'Tsukiji outer market', mapsLink: H('Tsukiji Outer Market Tokyo Japan') },
        { text: 'Ginza shopping', mapsLink: H('Ginza Tokyo Japan') },
      ]},
    ],
  },
  {
    dayNumber: 38,
    dayLabel: '38',
    title: 'TeamLab Planets',
    date: 'Mon, Apr 13 · Tokyo · Reserved',
    region: 'tokyo',
    mapsLink: H('TeamLab Planets Tokyo Japan'),
    sections: [
      { title: 'Attractions', items: [
        { text: 'TeamLab Planets (tickets reserved — 221 NIS via official site)', tip: 'You walk through water — wear shorts or clothes you can roll up above the knee. Lockers provided for shoes and bags. Allow 2-3 hours. Amazing for photos!', mapsLink: H('TeamLab Planets Tokyo Japan') },
        { text: 'Last full day — soak it all in!' },
      ]},
    ],
  },
  {
    dayNumber: 39,
    dayLabel: '39',
    title: 'Departure Day',
    date: 'Tue, Apr 14 · Evening flight from Haneda',
    region: 'tokyo',
    mapsLink: H('Tokyo Haneda Airport Japan'),
    sections: [
      { title: 'Plan', items: [
        { text: 'Last-minute shopping' },
        { text: 'Revisit favorite spots' },
        { text: 'Evening departure from Haneda', mapsLink: H('Tokyo Haneda Airport Japan') },
      ]},
    ],
  },
];

export function findDayByNumber(dayNumber: number): TripDay | undefined {
  const num = dayNumber;
  for (const d of TRIP_DAYS) {
    if (d.dayNumber === num) return d;
    if (d.dayLabel.includes('-')) {
      const [start, end] = d.dayLabel.split('-').map(Number);
      if (!Number.isNaN(end) && num >= start && num <= end) return d;
    }
  }
  return undefined;
}
