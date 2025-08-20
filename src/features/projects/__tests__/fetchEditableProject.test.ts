import InMemoryAssetRepository from '@/features/assets/__mocks__/inMemoryAssetRepository';
import Asset from '@/features/assets/domains';
import { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import InMemoryProjectRepository from '@/features/projects/__mocks__/inMemoryProjectRepository';
import { Token } from '@/lib/di/types';
import { createId } from '@paralleldrive/cuid2';
import 'reflect-metadata';
import { container } from 'tsyringe';
import Project, { ProjectStatus } from '../domains';
import FetchEditableProjectUsecase from '../usecases/fetchEditableProject';

// モックの準備
const mockAssetStorageService: IAssetStorageService = {
  upload: jest.fn(),
  downloads: jest.fn(),
};

let usecase: FetchEditableProjectUsecase;
let inMemoryProjectRepository: InMemoryProjectRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;

beforeEach(() => {
  container.clearInstances();
  inMemoryProjectRepository = new InMemoryProjectRepository();
  inMemoryAssetRepository = new InMemoryAssetRepository();

  container.register(Token.ProjectRepository, {
    useValue: inMemoryProjectRepository,
  });
  container.register(Token.AssetStorageService, {
    useValue: mockAssetStorageService,
  }); // ここはAssetStorageServiceのモックのまま
  usecase = container.resolve(FetchEditableProjectUsecase);
});

it('should return project data if project is editable', async () => {
  const projectId = createId();
  const userId = createId();
  const assetId = createId();

  const mockProject = new Project({
    id: projectId,
    title: 'Editable Project',
    workspaceJson: '{"blocks":{}}',
    status: ProjectStatus.Active,
    assetIds: [assetId],
    ownerUserId: userId,
  });

  const mockAsset = new Asset({
    id: assetId,
    name: 'asset.txt',
    path: 'https://example.com/signed-url',
  });

  // InMemoryRepositoryにデータを追加
  inMemoryProjectRepository.add(mockProject);
  // AssetStorageServiceのdownloadsはAssetRepositoryのfindByIdを使うので、AssetRepositoryにAssetを追加
  // ここはAssetStorageServiceのモックのままなので、downloadsをモックする
  (mockAssetStorageService.downloads as jest.Mock).mockResolvedValue([
    mockAsset,
  ]);

  const result = await usecase.execute(projectId, userId);

  expect(mockAssetStorageService.downloads).toHaveBeenCalledWith([assetId]);
  expect(result.projectJson).toBe('{"blocks":{}}');
  expect(result.projectAssets).toHaveLength(1);
  expect(result.projectAssets[0].id).toBe(assetId);
  expect(result.projectAssets[0].path).toBe('https://example.com/signed-url');
});

it('should throw error if project not found', async () => {
  // InMemoryRepositoryは空のまま
  await expect(usecase.execute(createId(), createId())).rejects.toThrow(
    'Project not found or not editable'
  );
});

it('should throw error if project is not editable by the user', async () => {
  const projectId = createId();
  const ownerId = createId();
  const requesterId = createId(); // 別のユーザー

  const mockProject = new Project({
    id: projectId,
    title: 'Not Your Project',
    workspaceJson: '{}',
    status: ProjectStatus.Active,
    assetIds: [],
    ownerUserId: ownerId,
  });

  // InMemoryRepositoryにデータを追加
  inMemoryProjectRepository.add(mockProject);

  await expect(usecase.execute(projectId, requesterId)).rejects.toThrow(
    'Project not found or not editable'
  );
});
