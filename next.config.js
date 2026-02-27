/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// next-pwa causes dev to crash (fast-glob) and can hang production build locally.
// Only enable on Netlify (CI=true) so local build/start works; deploy keeps PWA.
const usePWA = process.env.NODE_ENV === 'production' && process.env.CI === 'true';
if (usePWA) {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
