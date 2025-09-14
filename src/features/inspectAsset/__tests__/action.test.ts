import { IAssetStorage } from '@/domains/asset';
import { AssetNotFoundError } from '@/errors';
import { container, Token } from '@/lib/di';
import { MockFile } from '@/lib/jest/__mocks__/file';

import { fetchAssetFiles } from '../action';

let assetStorage: IAssetStorage;

beforeEach(() => {
  assetStorage = container.resolve<IAssetStorage>(Token.AssetStorage);
});

it('should fetch asset files by their ids', async () => {
  const file1 = new MockFile('file1.csv', 'content1');
  const file2 = new MockFile('file2.csv', 'content2');

  const uploadedAssets = await assetStorage.uploads([file1, file2]);
  const assetIds = uploadedAssets.map((asset) => asset.id.value);

  const downloadedAssets = await fetchAssetFiles(...assetIds);

  expect(downloadedAssets).toHaveLength(2);
  expect(downloadedAssets.map((a) => a.name)).toContain('file1.csv');
  expect(downloadedAssets.map((a) => a.name)).toContain('file2.csv');
});

it('should return an empty array if no ids are provided', async () => {
  const result = await fetchAssetFiles();
  expect(result).toEqual([]);
});

it('should throw AssetNotFoundError if any asset id does not exist', async () => {
  await expect(fetchAssetFiles('non-existent-id')).rejects.toThrow(
    AssetNotFoundError,
  );
});
