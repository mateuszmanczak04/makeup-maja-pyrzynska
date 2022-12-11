const { FaSleigh } = require('react-icons/fa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://makeup-maja-pyrzynska-mateuszmanczak04.vercel.app/',
  },
  // future: {
  //   webpack5: true,
  // },
  // webpack(config) {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //     net: false,
  //     tls: false,
  //     dns: false,
  //     child_process: false,
  //   };

  //   return config;
  // },
};

module.exports = nextConfig;
