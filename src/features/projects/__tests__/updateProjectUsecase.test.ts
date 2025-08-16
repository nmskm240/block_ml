import 'reflect-metadata';
import { container } from 'tsyringe';
import UpdateProjectUsecase from '../usecases/updateProjectUsecase';
import { IProjectRepository } from '../repositories';
import { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Token } from '@/lib/di/types';
import Project from '../domains';
import Asset from '@/features/assets/domains';
import { createId } from '@paralleldrive/cuid2';
import InMemoryProjectRepository from '../__mocks__/inMemoryProjectRepository';

// モックの準備
const mockAssetStorageService: IAssetStorageService = {
  upload: jest.fn(),
  downloads: jest.fn(),
};

// Fileのモック
const createMockFile = (name: string) => new File(['content'], name);

describe('UpdateProjectUsecase', () => {
  let usecase: UpdateProjectUsecase;
  let inMemoryProjectRepository: InMemoryProjectRepository;

  beforeEach(() => {
    container.clearInstances();
    inMemoryProjectRepository = new InMemoryProjectRepository();

    container.register(Token.ProjectRepository, {
      useValue: inMemoryProjectRepository,
    });
    container.register(Token.AssetStorageService, {
      useValue: mockAssetStorageService,
    });
    usecase = container.resolve(UpdateProjectUsecase);
    jest.clearAllMocks();
  });

  it('should update a project successfully', async () => {
    const projectId = createId();
    const userId = createId();
    const assetId = createId();
    const mockFile = createMockFile('new_asset.txt');

    const mockProject = new Project({
      id: projectId,
      title: 'Original Title',
      workspaceJson: '{}',
      status: 2, // Active
      assetIds: [],
      ownerUserId: userId,
    });

    const mockUploadedAsset = new Asset({
      id: assetId,
      name: mockFile.name,
      path: 'path',
    });

    // InMemoryRepositoryにデータを追加
    inMemoryProjectRepository.add(mockProject);
    (mockAssetStorageService.upload as jest.Mock).mockResolvedValue([
      mockUploadedAsset,
    ]); // uploadをモック

    const input = {
      id: projectId,
      json: '{"updated": true}',
      assets: [mockFile],
    };

    await usecase.execute(userId, input);

    expect(mockAssetStorageService.upload).toHaveBeenCalledWith([mockFile]); // uploadが呼ばれたことを確認
    // project.edit が呼ばれた後の状態で updateProject が呼ばれることを確認
    const updatedProject = await inMemoryProjectRepository.findProjectById(
      projectId
    );
    expect(updatedProject?.workspaceJson.value).toBe(input.json);
    expect(updatedProject?.assetIds.map((a) => a.value)).toEqual([assetId]);
  });

  it('should throw an error if project not found', async () => {
    // InMemoryRepositoryは空のまま
    const input = { id: createId(), json: '{}', assets: [] };
    await expect(usecase.execute(createId(), input)).rejects.toThrow(
      'Project not found'
    );
  });

  it('should throw an error if user is not the owner', async () => {
    const projectId = createId();
    const ownerId = createId();
    const requesterId = createId(); // 別のユーザー

    const mockProject = new Project({
      id: projectId,
      title: 'A Project',
      workspaceJson: '{}',
      status: 2, // Active
      assetIds: [],
      ownerUserId: ownerId,
    });

    // InMemoryRepositoryにデータを追加
    inMemoryProjectRepository.add(mockProject);

    const input = { id: projectId, json: '{}', assets: [] };
    await expect(usecase.execute(requesterId, input)).rejects.toThrow(
      'Permission denied'
    );
  });
});
