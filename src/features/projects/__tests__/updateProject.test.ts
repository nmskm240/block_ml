import 'reflect-metadata';
import Asset from '@/features/assets/domains';
import { IAssetRepository } from '@/features/assets/repositories';
import User, { UserId } from '@/features/users/domains';
import container from '@/lib/di/container';
import { Token } from '@/lib/di/types';
import { generateTestUser } from '@/lib/prisma/__tests__/test-helper';
import { createId } from '@paralleldrive/cuid2';
import Project from '../domains';
import { IProjectRepository } from '../repositories';
import { updateProject } from '../usecases';
import { MockFile } from '@/lib/jest/__mocks__/file';

let user: User;

beforeEach(async () => {
  user = await generateTestUser(container);
});

it('should update a project successfully', async () => {
  const project = Project.empty(user.id.value);
  const assetFile = new MockFile('asset.csv', 'test');
  const asset = Asset.from(assetFile);

  const projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository
  );
  const assetRepository = container.resolve<IAssetRepository>(
    Token.AssetRepository
  );

  await assetRepository.save(asset);
  await projectRepository.create(project);
  await updateProject(user.id.value, {
    id: project.id.value,
    json: '{"updated": true}',
    assets: [assetFile],
  });

  // project.edit が呼ばれた後の状態で updateProject が呼ばれることを確認
  const updatedProject = await projectRepository.findById(project.id.value);
  expect(updatedProject?.workspaceJson.value).toBe('"{\\"updated\\": true}"');
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

  const project = Project.empty(user.id.value);
  await projectRepository.create(project);

  const input = { id: project.id.value, json: '{}', assets: [] };
  await expect(updateProject(requesterId.value, input)).rejects.toThrow(
    'Permission denied'
  );
});
