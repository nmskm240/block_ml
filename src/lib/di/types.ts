export const Token = {
  SupabaseStorageClient: Symbol('SupabaseClient'),
  PrismaClient: Symbol('PrismaClient'),

  AssetRepository: Symbol('AssetRepository'),
  ProjectRepository: Symbol('ProjectRepository'),
  UserRepository: Symbol('UserRepository'),

  AuthService: Symbol('AuthService'),
  AssetStorageService: Symbol('StorageService'),
  ProjectService: Symbol('ProjectService'),
} as const;

export type Token = (typeof Token)[keyof typeof Token];
