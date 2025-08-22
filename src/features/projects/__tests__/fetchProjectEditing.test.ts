import 'reflect-metadata';
import { Token } from '@/lib/di/types';
import { createId } from '@paralleldrive/cuid2';
import container from '@/lib/di/container';
import Project from '../domains';
import User from '@/features/users/domains';
import { generateTestUser } from '@/lib/prisma/__tests__/test-helper';
import fetchProjectEditing from '../usecases/fetchProjectEditing';
import { IProjectRepository } from '../repositories';
import { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { MockFile } from '@/lib/jest/__mocks__/file';

let user: User;
let projectRepository: IProjectRepository;
let assetStorageService: IAssetStorageService;

beforeEach(async () => {
  projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository
  );
  assetStorageService = container.resolve<IAssetStorageService>(
    Token.AssetStorageService
  );
  user = await generateTestUser(container);
});

it('should return project data if project is editable', async () => {
  const project = Project.empty(user.id.value);
  const assetFile = new MockFile('asset.txt', 'test');

  const assets = await assetStorageService.upload([assetFile]);
  project.edit(
    '{}',
    assets.map((x) => x.id.value)
  );
  await projectRepository.create(project);

  const result = await fetchProjectEditing(project.id.value);

  expect(result.id).toBe(project.id.value);
  expect(result.assets).toHaveLength(1);
  expect(result.assets[0].id).toBe(assets[0].id.value);
});

it('should throw error if project not found', async () => {
  await expect(fetchProjectEditing(createId())).rejects.toThrow(
    'Project not found'
  );
});
