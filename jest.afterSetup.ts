import 'reflect-metadata';
import '@/lib/di/registry';
import { cleanupDatabase } from '@/lib/jest/helper';

jest.mock('@/lib/supabase/client');
jest.mock('@/lib/prisma/client');
jest.mock('@/lib/nextAuth');

beforeEach(async () => {
  await cleanupDatabase();
});
