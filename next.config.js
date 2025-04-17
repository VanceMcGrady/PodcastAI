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
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  // Path to static files
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
};

export default nextConfig;