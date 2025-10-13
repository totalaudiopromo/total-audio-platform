/** @type {import('next').NextConfig} */
const nextConfig = {
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
