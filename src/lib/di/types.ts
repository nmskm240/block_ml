export const Token = {
  SupabaseClient: Symbol('SupabaseClient'),
  SupabaseStorageClient: Symbol('SupabaseStorageClient'),
  PrismaClient: Symbol('PrismaClient'),

  AssetRepository: Symbol('AssetRepository'),
  ProjectRepository: Symbol('ProjectRepository'),
  UserRepository: Symbol('UserRepository'),

  AssetStorage: Symbol('AssetStorageService'),
  UserStorage: Symbol('UserStorageService'),
  
  AuthService: Symbol('AuthService'),
  ProjectQueryService: Symbol('ProjectQueryService'),

  Logger: Symbol('Logger'),
} as const;
