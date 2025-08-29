import { createId } from '@paralleldrive/cuid2';

import { IAssetRepository, IAssetStorage } from '@/domains/asset';
import { Project, IProjectRepository } from '@/domains/project';
import { User } from '@/domains/user';
import { UserId } from '@/domains/user/valueObjects';
import { ProjectNotFoundError } from '@/errors';
import { container, Token } from '@/lib/di';
import { MockFile } from '@/lib/jest/__mocks__/file';
import { generateTestUser } from '@/lib/jest/helper';

import { fetchProjectEditing, updateProject } from '../actions';

let user: User;
let projectRepository: IProjectRepository;
let assetStorageService: IAssetStorage;

beforeEach(async () => {
  projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository,
  );
  assetStorageService = container.resolve<IAssetStorage>(Token.AssetStorage);
  user = await generateTestUser();
});

describe('fetchProjectEditing', () => {
  it('should return project data if project is editable', async () => {
    const project = Project.empty(user.id.value);
    const assetFile = new MockFile('asset.txt', 'test');

    const assets = await assetStorageService.uploads([assetFile]);
    project.edit(
      '{}',
      assets.map((x) => x.id.value),
    );
    await projectRepository.create(project);

    const result = await fetchProjectEditing(project.id.value);

    expect(result.id).toBe(project.id.value);
    expect(result.assets).toHaveLength(1);
  });

  it('should throw error if project not found', async () => {
    await expect(fetchProjectEditing(createId())).rejects.toThrow(
      ProjectNotFoundError,
    );
  });
});

describe('updateProject', () => {
  it('should update a project successfully', async () => {
    const project = Project.empty(user.id.value);
    const assetFile = new MockFile('asset.csv', 'test');

    await projectRepository.create(project);
    await updateProject(user.id.value, {
      id: project.id.value,
      json: '{"updated": true}',
      assets: [assetFile],
    });

    const updatedProject = await projectRepository.getById(project.id.value);
    expect(updatedProject?.workspace.value).toBe('"{\\"updated\\": true}"');
    expect(updatedProject?.assetIds).toHaveLength(1);

    const assetRepository = container.resolve<IAssetRepository>(
      Token.AssetRepository,
    );
    const assetId = updatedProject?.assetIds[0].value;
    const savedAsset = await assetRepository.findById(assetId!);
    expect(savedAsset?.name.value).toBe('asset.csv');
  });

  it('should throw an error if project not found', async () => {
    // InMemoryRepositoryは空のまま
    const input = { id: createId(), json: '{}', assets: [] };
    await expect(updateProject(createId(), input)).rejects.toThrow(
      ProjectNotFoundError,
    );
  });

  it('should throw an error if user is not the owner', async () => {
    const projectRepository = container.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );

    const requesterId = UserId.generate(); // 別のユーザー

    const project = Project.empty(user.id.value);
    await projectRepository.create(project);

    const input = { id: project.id.value, json: '{}', assets: [] };
    await expect(updateProject(requesterId.value, input)).rejects.toThrow(
      'Permission denied',
    );
  });
});
