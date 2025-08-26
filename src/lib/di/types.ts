export const Token = {
  SupabaseClient: Symbol('SupabaseClient'),
  SupabaseStorageClient: Symbol('SupabaseStorageClient'),
  PrismaClient: Symbol('PrismaClient'),

  AssetRepository: Symbol('AssetRepository'),
  ProjectRepository: Symbol('ProjectRepository'),
  UserRepository: Symbol('UserRepository'),

  AuthService: Symbol('AuthService'),
  AssetStorageService: Symbol('AssetStorageService'),
  UserStorageService: Symbol('UserStorageService'),
  ProjectQueryService: Symbol('ProjectQueryService'),

  Logger: Symbol('Logger'),
} as const;
