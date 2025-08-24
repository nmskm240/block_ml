import { container, Token } from '@/lib/di';
import { jestPrismaClient } from '@/lib/prisma/__mocks__/client';

process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key';

container.registerInstance(Token.PrismaClient, jestPrismaClient);
