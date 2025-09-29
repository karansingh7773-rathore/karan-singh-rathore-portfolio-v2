/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  allowedDevOrigins: ['http://192.168.29.193', 'http://192.168.29.193:3000', 'http://localhost', 'http://localhost:3000', 'http://192.168.29.193:80', '192.168.29.193'],
}

module.exports = nextConfig
