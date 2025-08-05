export const Token = {
  SupabaseStorageClient: Symbol('SupabaseClient'),
  PrismaClient: Symbol('PrismaClient'),

  ProjectRepository: Symbol('ProjectRepository'),
  UserRepository: Symbol('UserRepository'),

  StorageService: Symbol('StorageService'),
} as const;

export type Token = (typeof Token)[keyof typeof Token];
