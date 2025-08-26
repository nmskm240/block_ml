import 'reflect-metadata';
import '@/lib/di/registry';

jest.mock('@/lib/supabase/client');
jest.mock('@/lib/prisma/client');
jest.mock('@/lib/nextAuth/auth');
