import type { PrismaConfig } from 'prisma';

export default {
  schema: './prisma',
  earlyAccess: true,
} satisfies PrismaConfig;
