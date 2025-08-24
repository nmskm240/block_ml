import 'reflect-metadata';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';

import { User, IUserRepository } from '@/features/users';
import { Token, container } from '@/lib/di';

let repository: IUserRepository;
let prisma: PrismaClient;

beforeEach(() => {
  prisma = container.resolve(Token.PrismaClient);
  repository = container.resolve(Token.UserRepository);
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

    expect(foundUser).not.toBeUndefined();
    expect(foundUser).toBeInstanceOf(User);
    expect(foundUser!.email.value).toBe(userData.email);
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
    const newUser = User.new({
      name: 'New User',
      email: 'new@example.com',
      password: 'plain_password',
    });

    const savedUser = await repository.create(newUser);

    const dbUser = await prisma.user.findUnique({
      where: { id: savedUser.id.value },
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
