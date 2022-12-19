const { FaSleigh } = require('react-icons/fa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://makeup-maja-pyrzynska.vercel.app',
  },
};

module.exports = nextConfig;
