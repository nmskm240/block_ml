import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@/lib/prisma';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/repositories/ProjectRepository';
import {
  AuthService,
  IAuthService,
} from '@/features/auth/services/AuthService';
import { IStorageService, StorageService } from '@/services/StorageService';

const prisma = new PrismaClient();

container.registerSingleton<IAuthService>(AuthService);
container.registerInstance(PrismaClient, prisma);
container.registerSingleton<IProjectRepository>(ProjectRepository);
container.registerSingleton<IStorageService>(StorageService);

export default container;
