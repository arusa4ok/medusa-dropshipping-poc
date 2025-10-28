/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude backend and other non-frontend files from build
  excludeDefaultMomentLocales: true,
  outputFileTracingIncludes: {
    '/': ['./app/**/*', './components/**/*'],
  },
  // Clean up build process
  distDir: '.next',
  // Ignore backend files
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
