import {
  AssetRepository,
  IAssetRepository,
} from '@/features/assets/repositories';
import {
  AssetStorageService,
  IAssetStorageService,
} from '@/features/assets/services/assetStorageService';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import {
  IProjectService,
  ProjectService,
} from '@/features/projects/services/projectService';
import { IUserRepository, UserRepository } from '@/features/users/repositories';
import {
  AuthService,
  IAuthService,
} from '@/features/users/services/authService';
import { Prisma, PrismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { StorageClient } from '@supabase/storage-js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { prisma } from '../prisma/prisma';
import { Token } from './types';
import UpdateProjectUsecase from '@/features/projects/usecases/updateProjectUsecase';

container.registerInstance<StorageClient>(
  Token.SupabaseStorageClient,
  supabase.storage
);
container.registerInstance<PrismaClient>(Token.PrismaClient, prisma);

container.registerType<IAssetRepository>(
  Token.AssetRepository,
  AssetRepository
);
container.registerType<IProjectRepository>(
  Token.ProjectRepository,
  ProjectRepository
);
container.registerType<IUserRepository>(Token.UserRepository, UserRepository);

container.registerType<IProjectService>(Token.ProjectService, ProjectService);
container.registerType<IAssetStorageService>(
  Token.AssetStorageService,
  AssetStorageService
);
container.registerType<IAuthService>(Token.AuthService, AuthService);

container.register(UpdateProjectUsecase, UpdateProjectUsecase);

export default container;

export function withTransaction(tx: Prisma.TransactionClient) {
  const child = container.createChildContainer();

  child.registerInstance<Prisma.TransactionClient>(Token.PrismaClient, tx);

  return child;
}
