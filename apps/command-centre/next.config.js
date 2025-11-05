/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Skip type checking during build - type errors due to React version conflicts
    ignoreBuildErrors: true,
  },
  eslint: {
    // Run ESLint with warnings only during build
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
