export const Token = {
  SupabaseClient: Symbol('SupabaseClient'),
  SupabaseStorageClient: Symbol('SupabaseStorageClient'),
  PrismaClient: Symbol('PrismaClient'),

  AssetRepository: Symbol('AssetRepository'),
  ProjectRepository: Symbol('ProjectRepository'),
  UserRepository: Symbol('UserRepository'),

  AuthService: Symbol('AuthService'),
  AssetStorageService: Symbol('StorageService'),
  ProjectService: Symbol('ProjectService'),
  UserService: Symbol("UserService"),
} as const;

export type Token = (typeof Token)[keyof typeof Token];
