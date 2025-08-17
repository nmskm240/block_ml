import Asset from '@/features/assets/domains';
import { Token } from '@/lib/di/types';
import { createId } from '@paralleldrive/cuid2';
import 'reflect-metadata';
import container from '@/lib/di/container';
import Project from '../domains';
import { updateProject } from '../usecases';
import { IProjectRepository } from '../repositories';
import User, { UserId } from '@/features/users/domains';
import { generateTestUser } from '@/lib/prisma/__tests__/test-helper';
import { IAssetRepository } from '@/features/assets/repositories';

let user: User;

beforeEach(async () => {
  user = await generateTestUser(container);

  jest.clearAllMocks();
});

it('should update a project successfully', async () => {
  const project = Project.empty(user.id);
  const assetFile = new File(['content'], 'asset');
  const asset = Asset.from(assetFile);

  const projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository
  );
  const assetRepository = container.resolve<IAssetRepository>(
    Token.AssetRepository
  );

  await assetRepository.save(asset);
  await projectRepository.createProject(project);
  await updateProject(user.id!, {
    id: project.id.value,
    json: '{"updated": true}',
    assets: [assetFile],
  });

  // project.edit が呼ばれた後の状態で updateProject が呼ばれることを確認
  const updatedProject = await projectRepository.findProjectById(
    project.id.value
  );
  expect(updatedProject?.workspaceJson.value).toBe('{"updated": true}');
  expect(updatedProject?.assetIds.map((a) => a.value)).toEqual([
    asset.id.value,
  ]);
});

it('should throw an error if project not found', async () => {
  // InMemoryRepositoryは空のまま
  const input = { id: createId(), json: '{}', assets: [] };
  await expect(updateProject(createId(), input)).rejects.toThrow(
    'Project not found'
  );
});

it('should throw an error if user is not the owner', async () => {
  const projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository
  );

  const requesterId = UserId.generate(); // 別のユーザー

  const project = Project.empty(user.id);
  await projectRepository.createProject(project);

  const input = { id: project.id.value, json: '{}', assets: [] };
  await expect(updateProject(requesterId.value, input)).rejects.toThrow(
    'Permission denied'
  );
});
