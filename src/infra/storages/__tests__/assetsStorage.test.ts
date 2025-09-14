import { StorageClient } from '@supabase/storage-js';

import { Asset, IAssetRepository, IAssetStorage } from '@/domains/asset';
import { AssetId } from '@/domains/asset/valueObjects';
import { AssetNotFoundError } from '@/errors';
import { container, Token } from '@/lib/di';
import { MockFile } from '@/lib/jest/__mocks__/file';

let client: StorageClient;
let storage: IAssetStorage;
let repository: IAssetRepository;

beforeEach(() => {
  client = container.resolve(Token.SupabaseStorageClient);
  storage = container.resolve(Token.AssetStorage);
  repository = container.resolve(Token.AssetRepository);
});

describe('upload', () => {
  it('should upload a file and save the asset', async () => {
    const file = new MockFile('test1.png', 'image/png');
    const assets = await storage.uploads([file]);

    expect(assets.length).toBe(1);
    const asset = assets[0];

    // 実際にDBに保存されたか確認
    const found = await repository.findById(asset.id.value);
    expect(found).toBeDefined();
    expect(found?.id.equals(asset.id)).toBe(true);

    const { data, error } = await client
      .from('assets')
      .exists(asset.path.value);
    expect(error).toBeNull();
    expect(data).toBeTruthy();
  });
});

describe('downloads', () => {
  let asset: Asset;
  let file: File;

  beforeEach(async () => {
    file = new MockFile('test.txt', 'text/plain');
    asset = Asset.from(file);

    await client.from('assets').upload(asset.path.value, file);
    await repository.save(asset);
  });

  it('should download a file for a given id', async () => {
    const downloadedFiles = await storage.downloads([asset.id.value]);

    expect(downloadedFiles.length).toBe(1);

    const download = downloadedFiles[0];

    expect(download).toBeInstanceOf(File);
    expect(download.name).toBe(file.name);
  });

  it('should throw AssetNotFoundError if asset not found', async () => {
    const nonExistentId = AssetId.generate().value;
    await expect(storage.downloads([nonExistentId])).rejects.toThrow(
      new AssetNotFoundError(nonExistentId),
    );
  });
});
