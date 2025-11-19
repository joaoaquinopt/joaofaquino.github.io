/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    unoptimized: true 
  },
  // Ensure proper compilation
  compress: true,
};

export default nextConfig;