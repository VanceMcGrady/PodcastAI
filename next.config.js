/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  env: {
    // Any public environment variables
  },
  // Increase API response size limit for audio uploads
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/audio/:path*',
        destination: '/api/audio/:path*',
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];
    return config;
  },
  // This setting ensures Next.js config is found in the correct location
  distDir: '.next',
  // Path to static files
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
};

module.exports = nextConfig;