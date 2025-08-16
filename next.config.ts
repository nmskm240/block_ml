import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  webpack: (config, { dev }) => {
    if(dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 200,
      };
    }
    return config;
  }
};

export default nextConfig;
