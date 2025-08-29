import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { User, toDomain, toEntity, IUserRepository } from '@/domains/user';
import { UserNotFoundError } from '@/domains/errors';
import { Token } from '@/lib/di';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(Token.PrismaClient)
    private readonly _client: PrismaClient | Prisma.TransactionClient,
  ) {}

  async create(user: User): Promise<User> {
    const entity = toEntity(user);
    const saved = await this._client.user.create({
      data: entity,
    });
    return toDomain(saved);
  }

  async findById(userId: string): Promise<User | undefined> {
    const entity = await this._client.user.findUnique({
      where: { id: userId },
    });

    if (!entity) {
      return undefined;
    }

    return toDomain(entity);
  }

  async getById(userId: string): Promise<User> {
    const entity = await this._client.user.findUnique({
      where: { id: userId },
    });

    if (!entity) {
      throw new UserNotFoundError(userId);
    }

    return toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const entity = await this._client.user.findUnique({
      where: { email: email },
    });

    if (!entity) {
      return undefined;
    }

    return toDomain(entity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this._client.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  async update(user: User): Promise<User> {
    const entity = toEntity(user);
    const updated = await this._client.user.update({
      where: { id: user.id.value },
      data: {
        name: entity.name,
        email: entity.email,
        password: entity.password,
        image: entity.image,
      },
    });
    return toDomain(updated);
  }
}
