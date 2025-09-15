import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.py$/,
      type: 'asset/source',
    });
    return config;
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;

