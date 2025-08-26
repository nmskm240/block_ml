import { randomUUID } from 'crypto';

import { Session } from 'next-auth';
import { DependencyContainer } from 'tsyringe';

import { IUserRepository, User } from '@/features/users';
import { Token } from '@/lib/di';
import { auth } from '@/lib/nextAuth/__mocks__/auth';

export async function generateTestUser(container: DependencyContainer) {
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

export function updateSession(session: Session) {
  auth.mockResolvedValue(session);
}
