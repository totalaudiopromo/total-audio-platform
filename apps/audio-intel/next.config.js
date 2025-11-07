/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds (matching tracker config)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build (matching tracker config)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
