import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import { IUserRepository, UserRepository } from '@/features/users/repositories';
import {
  AuthService,
  IAuthService,
} from '@/features/users/services/authService';
import { Prisma, PrismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { IStorageService, StorageService } from '@/services/StorageService';
import { StorageClient } from '@supabase/storage-js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { prisma } from '../prisma/prisma';
import { Token } from './types';

container.registerInstance<StorageClient>(
  Token.SupabaseStorageClient,
  supabase.storage,
);
container.registerInstance<PrismaClient>(Token.PrismaClient, prisma);

container.register<IProjectRepository>(
  Token.ProjectRepository,
  ProjectRepository,
);
container.registerType<IUserRepository>(Token.UserRepository, UserRepository);

container.registerType<IStorageService>(Token.StorageService, StorageService);
container.registerSingleton<IAuthService>(AuthService);

export default container;

export function withTransaction(tx: Prisma.TransactionClient) {
  const child = container.createChildContainer();

  child.registerInstance<Prisma.TransactionClient>(Token.PrismaClient, tx);

  return child;
}
