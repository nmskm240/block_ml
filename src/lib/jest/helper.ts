import { randomUUID } from 'crypto';

import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

import { IUserRepository, User } from '@/domains/user';
import { container, Token } from '@/lib/di';
import { auth } from '@/lib/nextAuth/__mocks__/auth';

export async function cleanupDatabase() {
  const prisma = container.resolve<PrismaClient>(Token.PrismaClient);

  await Promise.all([
    prisma.userProject.deleteMany(),
    prisma.projectAsset.deleteMany(),
    prisma.user.deleteMany(),
    prisma.project.deleteMany(),
    prisma.asset.deleteMany(),
  ]);
}

export async function generateTestUser() {
  const userRepository = container.resolve<IUserRepository>(
    Token.UserRepository,
  );
  // 各テストの前に共通のユーザーを作成
  const user = User.new({
    name: 'Test user',
    email: `test-${randomUUID()}@example.com`,
    password: 'hoge',
  });
  await userRepository.create(user);
  return user;
}

export function updateSession(session: Session | null) {
  auth.mockResolvedValue(session);
}
