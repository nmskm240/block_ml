import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { StorageClient } from '@supabase/storage-js';
import { SupabaseClient } from '@supabase/supabase-js';

import { AssetRepository, IAssetRepository } from '@/features/assets';
import {
  AssetStorageService,
  IAssetStorageService,
} from '@/features/assets/services';
import { IProjectRepository, ProjectRepository } from '@/features/projects';
import { ProjectQueryService } from '@/features/projects/services';
import { IUserRepository, UserRepository } from '@/features/users';
import {
  AuthService,
  IAuthService,
  IUserStorageService,
  UserStorageService,
} from '@/features/users/services';
import logger, { Logger } from '@/lib/logger';
import prisma from '@/lib/prisma/client';
import supabaseClient from '@/lib/supabase/client';

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

container.register<IAssetStorageService>(
  Token.AssetStorageService,
  AssetStorageService,
);
container.register<IAuthService>(Token.AuthService, AuthService);
container.register<IUserStorageService>(
  Token.UserStorageService,
  UserStorageService,
);
container.register(Token.ProjectQueryService, ProjectQueryService);
