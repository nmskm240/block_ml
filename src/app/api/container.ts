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

const prisma = new PrismaClient();

container.registerSingleton<IAuthService>(AuthService);
container.registerInstance(PrismaClient, prisma);
container.registerSingleton<IProjectRepository>(ProjectRepository);

export default container;
