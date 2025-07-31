import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@/lib/prisma';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import {
  AuthService,
  IAuthService,
} from '@/features/auth/services/AuthService';
import { IStorageService, StorageService } from '@/services/StorageService';

const prisma = new PrismaClient();
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

container.registerSingleton<IAuthService>(AuthService);
container.registerInstance(PrismaClient, prisma);
container.registerSingleton<IProjectRepository>(ProjectRepository);
container.registerSingleton<IStorageService>(StorageService);

export default container;
