/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://makeup-maja-pyrzynska-mateuszmanczak04.vercel.app/',
  },
};

module.exports = nextConfig;
