import 'reflect-metadata';

import { Asset } from '@/features/assets';
import { IAssetStorageService } from '@/features/assets/services';
import { container, Token } from '@/lib/di';
import { MockFile } from '@/lib/jest/__mocks__/file';

let service: IAssetStorageService;

beforeEach(() => {
  service = container.resolve(Token.AssetStorageService);
});

describe('upload', () => {
  it('should upload files and save assets', async () => {
    const files = [new MockFile('test1.png', 'image/png')];
    const asset = Asset.from(files[0]);

    const result = await service.upload(files);
  });

  it('should throw an error if upload fails', async () => {
    const files = [new MockFile('test1.png', 'image/png')];

    await expect(service.upload(files)).rejects.toThrow(
      'Failed to upload test1.png: Upload failed',
    );
  });
});

// describe('downloads', () => {
//   it('should create signed urls for given asset ids', async () => {
//     const assetId = createId();
//     const asset = new Asset({ id: assetId, name: 'test.txt', path: assetId });

//     inMemoryAssetRepository.add(asset);
//     mockStorageClient.createSignedUrl.mockResolvedValue({
//       data: { signedUrl: 'https://example.com/signed-url' },
//       error: null,
//     });

//     const result = await service.downloads([assetId]);

//     expect(mockStorageClient.from).toHaveBeenCalledWith('assets');
//     expect(mockStorageClient.createSignedUrl).toHaveBeenCalledWith(
//       asset.id.value,
//       60,
//     );
//     expect(result[0].path.value).toBe('https://example.com/signed-url');
//   });

//   it('should throw an error if creating signed url fails', async () => {
//     const assetId = createId();
//     const asset = new Asset({ id: assetId, name: 'test.txt', path: assetId });

//     await expect(service.downloads([assetId])).rejects.toThrow(
//       `Failed to create signed URL for ${assetId}`,
//     );
//   });

//   it('should skip non-existent assets', async () => {
//     const result = await service.downloads([createId()]);
//     expect(result).toEqual([]);
//   });
// });
