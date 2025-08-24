import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { Token } from '@/lib/di/types';

import Asset from './domains';
import { toDomain, toEntity } from './mapper';

export interface IAssetRepository {
  findById(id: string): Promise<Asset | undefined>;
  save(asset: Asset): Promise<Asset>;
}

@injectable()
export class AssetRepository implements IAssetRepository {
  constructor(
    @inject(Token.PrismaClient)
    private readonly _client: PrismaClient | Prisma.TransactionClient,
  ) {}

  async findById(id: string): Promise<Asset | undefined> {
    const entity = await this._client.asset.findUnique({
      where: { id },
    });

    if (!entity) {
      return undefined;
    }

    return toDomain(entity);
  }

  async save(asset: Asset): Promise<Asset> {
    const entity = toEntity(asset);
    const saved = await this._client.asset.upsert({
      where: { id: entity.id },
      create: entity,
      update: entity,
    });

    return toDomain(saved);
  }
}
