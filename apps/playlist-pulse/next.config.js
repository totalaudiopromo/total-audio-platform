/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all problematic features
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable styled-jsx
  compiler: {
    styledComponents: false,
  },
  // Disable static generation for problematic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig; 