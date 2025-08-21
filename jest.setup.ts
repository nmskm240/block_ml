import { Token } from '@/lib/di/types';
import { jestPrismaClient } from '@/lib/prisma/__mocks__/jestClient';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key';

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      auth: { getUser: jest.fn() },
      storage: { from: jest.fn() },
    })),
    SupabaseClient: jest.fn(),
  };
});

jest.mock('@/lib/prisma/client', () => {
  return {
    __esModule: true,
    default: jestPrismaClient,
  };
});

container.registerInstance(Token.PrismaClient, jestPrismaClient);
