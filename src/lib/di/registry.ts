import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { StorageClient } from '@supabase/storage-js';
import { SupabaseClient } from '@supabase/supabase-js';

import { IAssetRepository, IAssetStorage } from '@/domains/asset';
import { IProjectRepository } from '@/domains/project';
import { IUserRepository, IUserStorage } from '@/domains/user';
import {
  AssetRepository,
  ProjectRepository,
  UserRepository,
} from '@/infra/repositories';
import { AssetStorage, UserStorage } from '@/infra/storages';
import logger, { Logger } from '@/lib/logger';
import prisma from '@/lib/prisma/client';
import supabaseClient from '@/lib/supabase/client';
import { AuthService, IAuthService, ProjectQueryService } from '@/services';

import container from './container';
import { Token } from './types';

container.registerInstance<Logger>(Token.Logger, logger);

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
container.registerInstance<PrismaClient>(
  Token.PrismaClient,
  prisma as PrismaClient,
);

container.register<IAssetRepository>(Token.AssetRepository, AssetRepository);
container.register<IProjectRepository>(
  Token.ProjectRepository,
  ProjectRepository,
);
container.register<IUserRepository>(Token.UserRepository, UserRepository);

container.register<IAssetStorage>(Token.AssetStorage, AssetStorage);
container.register<IUserStorage>(Token.UserStorage, UserStorage);

container.register<IAuthService>(Token.AuthService, AuthService);
container.register(Token.ProjectQueryService, ProjectQueryService);
