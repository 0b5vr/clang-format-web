/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // disable linting, since it takes Glitch resources
    ignoreDuringBuilds: true,
  },
  typescript: {
    // disable type checking, since it takes Glitch resources
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
