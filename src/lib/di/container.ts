import 'reflect-metadata';
import { Prisma, PrismaClient } from '@prisma/client';
import { StorageClient } from '@supabase/storage-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { container, DependencyContainer } from 'tsyringe';

import { AssetRepository, IAssetRepository } from '@/features/assets';
import {
  AssetStorageService,
  IAssetStorageService,
} from '@/features/assets/services';
import { IProjectRepository, ProjectRepository } from '@/features/projects';
import { IUserRepository, UserRepository } from '@/features/users';
import {
  AuthService,
  IAuthService,
  IUserStorageService,
  UserStorageService,
} from '@/features/users/services';
import { Token } from '@/lib/di';
import prisma from '@/lib/prisma/client';
import supabaseClient from '@/lib/supabase/client';

container.registerInstance<SupabaseClient>(
  Token.SupabaseClient,
  supabaseClient,
);
container.register<StorageClient>(Token.SupabaseStorageClient, {
  useFactory: (c) => {
    const client = c.resolve<SupabaseClient>(Token.SupabaseClient);
    return client.storage;
  },
});
container.registerInstance<PrismaClient>(Token.PrismaClient, prisma);

container.register<IAssetRepository>(Token.AssetRepository, AssetRepository);
container.register<IProjectRepository>(
  Token.ProjectRepository,
  ProjectRepository,
);
container.register<IUserRepository>(Token.UserRepository, UserRepository);

container.register<IAssetStorageService>(
  Token.AssetStorageService,
  AssetStorageService,
);
container.register<IAuthService>(Token.AuthService, AuthService);
container.register<IUserStorageService>(
  Token.UserStorageService,
  UserStorageService,
);

export default container;

export async function withTransactionScope<T>(
  process: (child: DependencyContainer) => Promise<T>,
) {
  const client = container.resolve<PrismaClient>(Token.PrismaClient);
  const child = container.createChildContainer();

  return await client.$transaction(async (tx) => {
    child.registerInstance<Prisma.TransactionClient>(Token.PrismaClient, tx);
    return await process(child);
  });
}
