/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.st-note.com',
        pathname: '/production/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'appdata.chatwork.com',
        pathname: '/avatar/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/company/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;