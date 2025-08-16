import 'reflect-metadata';
import { container } from 'tsyringe';
import { Token } from '@/lib/di/types';
import User, { UserStatus } from '../domains';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';
import { IUserRepository, UserRepository } from '../repositories';

// jest-prisma がグローバル prisma インスタンスをセットアップ
declare const jestPrisma: { client: PrismaClient };

describe('UserRepository with jest-prisma', () => {
  let repository: IUserRepository;
  const prisma: PrismaClient = jestPrisma.client;

  beforeAll(() => {
    container.register(Token.PrismaClient, { useValue: prisma });
    repository = container.resolve(UserRepository);
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const userData = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: '$2a$10$abcdefghijklmnopqrstuvwxy.abcdefghijkl',
        },
      });

      const foundUser = await repository.findByEmail(userData.email!);

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.email).toBe(userData.email);
    });

    it('should return undefined if not found by email', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user if found by id', async () => {
      const userData = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          name: 'Test User 2',
          password: '$2a$10$abcdefghijklmnopqrstuvwxy.abcdefghijkl',
        },
      });

      const foundUser = await repository.findById(userData.id);

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.id).toBe(userData.id);
    });

    it('should return undefined if not found by id', async () => {
      const foundUser = await repository.findById(createId());
      expect(foundUser).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should create a new user if it does not exist', async () => {
      const newUser = User.new('New User', 'new@example.com', 'plain_password');

      const savedUser = await repository.create(newUser);

      const dbUser = await prisma.user.findUnique({
        where: { id: savedUser.id! },
      });

      expect(savedUser.email).toBe('new@example.com');
      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe('new@example.com');
    });

    // TODO: 機能実装
    // it('should update an existing user', async () => {
    //   const userData = await prisma.user.create({
    //     data: {
    //       email: 'update@example.com',
    //       name: 'Original Name',
    //       password: '$2a$10$abcdefghijklmnopqrstuvwxy.abcdefghijkl',
    //     },
    //   });

    //   const userToUpdate = new User(
    //     'Updated Name',
    //     userData.email!,
    //     'plain_password', // 平文パスワードを渡す
    //     UserStatus.Active,
    //     userData.id
    //   );

    //   const savedUser = await repository.save(userToUpdate);
    //   const dbUser = await prisma.user.findUnique({ where: { id: userData.id } });

    //   expect(savedUser.name).toBe('Updated Name');
    //   expect(dbUser?.name).toBe('Updated Name');
    // });
  });
});
