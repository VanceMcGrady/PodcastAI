/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/audio/:path*',
        destination: '/api/audio/:path*',
      },
    ];
  },
};

export default nextConfig;