import 'reflect-metadata';
import { container } from 'tsyringe';
import { AssetStorageService } from '../services/assetStorageService';
import { Token } from '@/lib/di/types';
import Asset from '../domains';
import { createId } from '@paralleldrive/cuid2';
import InMemoryAssetRepository from '../__mocks__/inMemoryAssetRepository';

// Fileオブジェクトのモック
const createMockFile = (name: string, type: string) => {
  const blob = new Blob(['test']);
  return new File([blob], name, { type });
};

// モックの準備
const mockStorageClient = {
  from: jest.fn().mockReturnThis(),
  upload: jest.fn(),
  createSignedUrl: jest.fn(),
};

let service: AssetStorageService;
let inMemoryAssetRepository: InMemoryAssetRepository;

beforeEach(() => {
  // DIコンテナをリセットし、モックを登録
  container.clearInstances();
  inMemoryAssetRepository = new InMemoryAssetRepository();
  container.register(Token.SupabaseStorageClient, {
    useValue: mockStorageClient as any,
  });
  container.register(Token.AssetRepository, {
    useValue: inMemoryAssetRepository,
  });

  service = container.resolve(AssetStorageService);

  // 各テストの前にモックをリセット
  jest.clearAllMocks();
  // fromがthisを返すように再設定
  mockStorageClient.from.mockReturnThis();
});

describe('upload', () => {
  it('should upload files and save assets', async () => {
    const files = [createMockFile('test1.png', 'image/png')];
    const asset = Asset.from(files[0]);

    // Asset.from は内部でIDを生成するため、それをモックして固定値を返す
    jest.spyOn(Asset, 'from').mockReturnValue(asset);

    mockStorageClient.upload.mockResolvedValue({
      data: { path: asset.path.value },
      error: null,
    });

    const result = await service.upload(files);

    expect(mockStorageClient.from).toHaveBeenCalledWith('assets');
    expect(mockStorageClient.upload).toHaveBeenCalledWith(
      asset.path.value,
      files[0],
      expect.any(Object)
    );
    expect(inMemoryAssetRepository.assets).toContain(asset);
    expect(result).toEqual([asset]);
  });

  it('should throw an error if upload fails', async () => {
    const files = [createMockFile('test1.png', 'image/png')];
    mockStorageClient.upload.mockResolvedValue({
      data: null,
      error: new Error('Upload failed'),
    });

    await expect(service.upload(files)).rejects.toThrow(
      'Failed to upload test1.png: Upload failed'
    );
  });
});

describe('downloads', () => {
  it('should create signed urls for given asset ids', async () => {
    const assetId = createId();
    const asset = new Asset({ id: assetId, name: 'test.txt', path: assetId });

    inMemoryAssetRepository.add(asset);
    mockStorageClient.createSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://example.com/signed-url' },
      error: null,
    });

    const result = await service.downloads([assetId]);

    expect(mockStorageClient.from).toHaveBeenCalledWith('assets');
    expect(mockStorageClient.createSignedUrl).toHaveBeenCalledWith(
      asset.id.value,
      60
    );
    expect(result[0].path.value).toBe('https://example.com/signed-url');
  });

  it('should throw an error if creating signed url fails', async () => {
    const assetId = createId();
    const asset = new Asset({ id: assetId, name: 'test.txt', path: assetId });

    inMemoryAssetRepository.add(asset);
    mockStorageClient.createSignedUrl.mockResolvedValue({
      data: null,
      error: new Error('Failed'),
    });

    await expect(service.downloads([assetId])).rejects.toThrow(
      `Failed to create signed URL for ${assetId}`
    );
  });

  it('should skip non-existent assets', async () => {
    const result = await service.downloads([createId()]);
    expect(result).toEqual([]);
    expect(mockStorageClient.createSignedUrl).not.toHaveBeenCalled();
  });
});
