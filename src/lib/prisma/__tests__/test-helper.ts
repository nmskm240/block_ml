import User from '@/features/users/domains';
import { IUserRepository } from '@/features/users/repositories';
import { Token } from '@/lib/di/types';
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { DependencyContainer } from 'tsyringe';

export async function cleanupDatabase(prisma: PrismaClient) {
  // Prismaのメタ情報から、このプロジェクトで使われている全モデル名を取得
  const modelNames = Prisma.dmmf.datamodel.models.map(
    (model) => `"${model.dbName || model.name}"`
  );

  if (modelNames.length === 0) {
    return;
  }

  // 全テーブルをTRUNCATEするSQLを組み立てる
  const truncateQuery = `TRUNCATE TABLE ${modelNames.join(
    ', '
  )} RESTART IDENTITY CASCADE;`;

  // 組み立てたSQLを実行
  await prisma.$executeRawUnsafe(truncateQuery);
}

export async function generateTestUser(container: DependencyContainer) {
  const userRepository = container.resolve<IUserRepository>(
    Token.UserRepository
  );
  // 各テストの前に共通のユーザーを作成
  const user = User.new(
    'Test user',
    `test-${randomUUID()}@example.com`,
    'hoge'
  );
  await userRepository.create(user);
  return user;
}
