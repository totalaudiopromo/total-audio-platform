/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      {
        source: '/marketing',
        destination: '/social-media-hub',
        permanent: false,
      },
    ];
  }
}

module.exports = nextConfig
