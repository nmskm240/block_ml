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
import prisma from '@/lib/prisma/service';
import { StorageClient } from '@supabase/storage-js';
import 'reflect-metadata';
import {
  container,
  DependencyContainer,
  instanceCachingFactory,
} from 'tsyringe';
import { Token } from '@/lib/di/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

container.registerInstance<SupabaseClient>(
  Token.SupabaseClient,
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
);
container.register<StorageClient>(Token.SupabaseStorageClient, {
  useFactory: instanceCachingFactory((c) => {
    const client = c.resolve<SupabaseClient>(Token.SupabaseClient);
    return client.storage;
  }),
});
container.registerInstance<PrismaClient>(Token.PrismaClient, prisma);

container.register<IAssetRepository>(Token.AssetRepository, AssetRepository);
container.register<IProjectRepository>(
  Token.ProjectRepository,
  ProjectRepository
);
container.register<IUserRepository>(Token.UserRepository, UserRepository);

container.register<IProjectService>(Token.ProjectService, ProjectService);
container.register<IAssetStorageService>(
  Token.AssetStorageService,
  AssetStorageService
);
container.register<IAuthService>(Token.AuthService, AuthService);

export default container;

export async function withTransactionScope<T>(
  process: (child: DependencyContainer) => Promise<T>
) {
  const client = container.resolve<PrismaClient>(Token.PrismaClient);
  const child = container.createChildContainer();

  return await client.$transaction(async (tx) => {
    child.registerInstance<Prisma.TransactionClient>(Token.PrismaClient, tx);
    return await process(child);
  });
}
