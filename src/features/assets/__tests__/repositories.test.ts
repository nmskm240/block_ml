import 'reflect-metadata';
import { container } from 'tsyringe';
import { AssetRepository } from '../repositories';
import { Token } from '@/lib/di/types';
import Asset from '../domains';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';

// jest-prisma がグローバル prisma インスタンスをセットアップ
declare const jestPrisma: { client: PrismaClient };

describe('AssetRepository with jest-prisma', () => {
  let repository: AssetRepository;
  const prisma: PrismaClient = jestPrisma.client;

  beforeAll(() => {
    container.register(Token.PrismaClient, { useValue: prisma });
    repository = container.resolve(AssetRepository);
  });

  describe('findById', () => {
    it('should return an asset if found', async () => {
      const assetData = await prisma.asset.create({
        data: {
          id: createId(),
          fileName: 'test.txt',
          filePath: 'test.txt',
        },
      });

      const foundAsset = await repository.findById(assetData.id);

      expect(foundAsset).toBeInstanceOf(Asset);
      expect(foundAsset?.id.value).toBe(assetData.id);
      expect(foundAsset?.name.value).toBe(assetData.fileName);
    });

    it('should return undefined if not found', async () => {
      const foundAsset = await repository.findById(createId());
      expect(foundAsset).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should create a new asset if it does not exist', async () => {
      const newAsset = new Asset({
        id: createId(),
        name: 'new-asset.png',
        path: 'new-asset.png',
      });

      const savedAsset = await repository.save(newAsset);

      const dbAsset = await prisma.asset.findUnique({ where: { id: newAsset.id.value } });

      expect(savedAsset.id.value).toBe(newAsset.id.value);
      expect(dbAsset).not.toBeNull();
      expect(dbAsset?.fileName).toBe('new-asset.png');
    });

    it('should update an existing asset', async () => {
      const assetData = await prisma.asset.create({
        data: {
          id: createId(),
          fileName: 'original-name.jpg',
          filePath: 'original-name.jpg',
        },
      });

      const assetToUpdate = new Asset({
        id: assetData.id,
        name: 'updated-name.jpg',
        path: 'updated-name.jpg',
      });

      const savedAsset = await repository.save(assetToUpdate);
      const dbAsset = await prisma.asset.findUnique({ where: { id: assetData.id } });

      expect(savedAsset.name.value).toBe('updated-name.jpg');
      expect(dbAsset?.fileName).toBe('updated-name.jpg');
    });
  });
});
