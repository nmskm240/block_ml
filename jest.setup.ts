import 'reflect-metadata';
import { Token } from '@/lib/di/types';
import { jestPrismaClient } from '@/lib/prisma/__mocks__/jestClient';
import { createMockSupabaseClient } from '@/lib/supabase/__mocks__/client';
import { container } from 'tsyringe';
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key';

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: createMockSupabaseClient,
  };
});

jest.mock('@/lib/prisma/client', () => {
  return {
    __esModule: true,
    default: jestPrismaClient,
  };
});

container.registerInstance(Token.SupabaseClient, createMockSupabaseClient());
container.registerInstance(Token.PrismaClient, jestPrismaClient);
