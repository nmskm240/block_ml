import { PrismaClient } from '@prisma/client';

import logger from '@/lib/logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  logger.info(
    {
      query: e.query,
      params: e.params,
      duration: e.duration,
    },
    'Prisma query',
  );
});

prisma.$on('error', (e) => {
  logger.error({ error: e }, 'Prisma error');
});

prisma.$on('info', (e) => {
  logger.info({ info: e }, 'Prisma info');
});

prisma.$on('warn', (e) => {
  logger.warn({ warn: e }, 'Prisma warn');
});

const extended = prisma.$extends({
  query: {
    project: {
      update: async ({ args }) => {
        if (args.data.status) {
          args.data.statusUpdatedAt = new Date();
        }
      },
      updateMany: async ({ args }) => {
        if (args.data.status) {
          args.data.statusUpdatedAt = new Date();
        }
      },
    },
  },
});

export default extended;
