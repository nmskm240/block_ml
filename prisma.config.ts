import type { PrismaConfig } from 'prisma';

export default {
  schema: './src/lib/prisma',
  earlyAccess: true,
} satisfies PrismaConfig;
