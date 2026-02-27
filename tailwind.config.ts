import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Noto Sans JP',
          'sans-serif',
        ],
      },
      colors: {
        background: '#FAFAF9',
        surface: '#FFFFFF',
        'text-primary': '#1C1917',
        'text-secondary': '#78716C',
        accent: '#EC4899',
        'accent-light': '#FDF2F8',
        divider: '#E7E5E4',
        tokyo: '#DC2626',
        kyoto: '#7C3AED',
        osaka: '#EA580C',
        rural: '#059669',
        kyushu: '#0284C7',
        okinawa: '#0891B2',
        aso: '#65A30D',
      },
      letterSpacing: {
        title: '-0.02em',
        body: '0.01em',
      },
      lineHeight: {
        title: '1.4',
        body: '1.6',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        tab: '0 -1px 0 0 #E7E5E4',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
