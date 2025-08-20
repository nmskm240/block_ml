import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: '@quramy/jest-prisma/environment',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/prisma/client$': '<rootDir>/src/lib/prisma/__mocks__/client.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@supabase/supabase-js|@supabase/realtime-js|isows|@blockly|blockly|react-plotly.js|plotly.js)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

export default createJestConfig(config);
