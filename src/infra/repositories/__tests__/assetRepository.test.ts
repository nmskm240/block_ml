import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';

import { Asset, IAssetRepository } from '@/domains/asset';
import { container, Token } from '@/lib/di';

let repository: IAssetRepository;
let prisma: PrismaClient;

beforeAll(() => {
  prisma = container.resolve<PrismaClient>(Token.PrismaClient);
  repository = container.resolve<IAssetRepository>(Token.AssetRepository);
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

describe('findByIds', () => {
  it('should return found assets', async () => {
    const asset1 = await prisma.asset.create({
      data: {
        id: createId(),
        fileName: 'test1.txt',
        filePath: 'test1.txt',
      },
    });
    const asset2 = await prisma.asset.create({
      data: {
        id: createId(),
        fileName: 'test2.txt',
        filePath: 'test2.txt',
      },
    });

    const foundAssets = await repository.findByIds([asset1.id, asset2.id]);

    expect(foundAssets).toHaveLength(2);
    expect(foundAssets.map((a) => a.id.value)).toContain(asset1.id);
    expect(foundAssets.map((a) => a.id.value)).toContain(asset2.id);
  });

  it('should return an empty array if no assets are found', async () => {
    const foundAssets = await repository.findByIds([createId(), createId()]);
    expect(foundAssets).toHaveLength(0);
  });

  it('should return only found assets', async () => {
    const asset1 = await prisma.asset.create({
      data: {
        id: createId(),
        fileName: 'test1.txt',
        filePath: 'test1.txt',
      },
    });

    const foundAssets = await repository.findByIds([asset1.id, createId()]);

    expect(foundAssets).toHaveLength(1);
    expect(foundAssets[0].id.value).toBe(asset1.id);
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

    const dbAsset = await prisma.asset.findUnique({
      where: { id: newAsset.id.value },
    });

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
    const dbAsset = await prisma.asset.findUnique({
      where: { id: assetData.id },
    });

    expect(savedAsset.name.value).toBe('updated-name.jpg');
    expect(dbAsset?.fileName).toBe('updated-name.jpg');
  });
});
