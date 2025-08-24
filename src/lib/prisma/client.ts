import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
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
    'Prisma query'
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
