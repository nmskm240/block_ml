import "reflect-metadata";
import { inject, injectable } from 'tsyringe';
import User from './domains';
import { toDomain, toEntity } from './mapper';
import { Prisma, PrismaClient } from '@prisma/client';
import { Token } from '@/lib/di/types';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  existsByEmail(email: string): Promise<boolean>;
}

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
}
