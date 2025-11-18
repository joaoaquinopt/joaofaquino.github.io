/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove 'output: export' for API routes to work
  images: { unoptimized: true },
};

export default nextConfig;