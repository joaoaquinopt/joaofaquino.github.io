/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // compatível com GitHub Pages ou Vercel
  images: { unoptimized: true },
};

export default nextConfig;