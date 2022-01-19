/** @type {import('next').NextConfig} */
const nextConfig = {
  exportPathMap: () => ({
    '/pools': { page: '/' },
  }),
  reactStrictMode: true,
}

module.exports = nextConfig
