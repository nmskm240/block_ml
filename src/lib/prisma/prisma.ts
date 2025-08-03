import { PrismaClient } from '@/lib/prisma';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

prisma.$extends({
  query: {
    projectEntity: {
      async update({ model, operation, args, query }) {
        const id = args.where.id;
        const incomingStatus = args.data.status;

        if (incomingStatus !== undefined && id !== undefined) {
          const current = await prisma.projectEntity.findUnique({
            where: { id },
            select: { status: true },
          });

          if (current && current.status !== incomingStatus) {
            args.data.statusUpdatedAt = new Date();
          }
        }

        return query(args);
      },
    },
  },
});
