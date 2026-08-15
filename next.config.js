/** @type {import('next').NextConfig} */
const nextConfig = {
  // SOPs/ is read at request/build time from the filesystem (see src/lib/content.ts),
  // not bundled as static assets, so no special webpack/content config is needed here.
  eslint: {
    // Linting is run separately via `npm run lint`; don't block `next build` on it.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
