/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
}

module.exports = nextConfig
