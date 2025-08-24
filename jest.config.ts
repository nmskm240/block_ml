import nextJest from 'next/jest.js';

import type { Config } from 'jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: '@quramy/jest-prisma/environment',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.afterSetup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/prisma/client$': '<rootDir>/src/lib/prisma/__mocks__/client.ts',
    '^@supabase/supabase-js$':
      '<rootDir>/src/lib/supabase/__mocks__/supabase-js.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  transformIgnorePatterns: ['/node_modules/(?!(.*)/(es|esm)/)'],
  transform: {
    '^.+.(js|jsx)$': 'babel-jest',
    '^.*node_modules/(isows|@supabase)/.+.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

export default createJestConfig(config);
