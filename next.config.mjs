/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Ensure proper compilation
  compress: true,
  // Production optimizations
  poweredByHeader: false,
};

export default nextConfig;