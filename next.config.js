/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    // Any public environment variables
  },
  distDir: ".next",
  async rewrites() {
    return [
      {
        source: "/audio/:path*",
        destination: "/api/audio/:path*",
      },
    ];
  },
};

export default nextConfig;
