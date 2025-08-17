import 'reflect-metadata';
import container from '@/lib/di/container';
import { IProjectRepository } from '@/features/projects/repositories';
import { Token } from '@/lib/di/types';
import Project from '@/features/projects/domains';
import { createId } from '@paralleldrive/cuid2';
import User from '@/features/users/domains';
import { PrismaClient } from '@prisma/client';
import { IAssetRepository } from '@/features/assets/repositories';
import Asset, { AssetId } from '@/features/assets/domains';
import { generateTestUser } from '@/lib/prisma/__tests__/test-helper';

let user: User;
let repository: IProjectRepository;

beforeEach(async () => {
  user = await generateTestUser(container);
  repository = container.resolve<IProjectRepository>(Token.ProjectRepository);
});

describe('findProjectById', () => {
  it('should return a project if found', async () => {
    const project = Project.empty(user.id);

    project.rename('Find Me');
    await repository.createProject(project);

    const found = await repository.findProjectById(project.id.value);
    expect(found).toBeInstanceOf(Project);
    expect(found?.id.value).toBe(project.id.value);
    expect(found?.title.value).toBe('Find Me');
    expect(found?.ownerUserId?.value).toBe(user.id);
  });

  it('should return undefined if not found', async () => {
    const foundProject = await repository.findProjectById(createId());
    expect(foundProject).toBeUndefined();
  });
});

describe('findProjectsByUserId', () => {
  it('should return all projects for a user', async () => {
    for (const i of [1, 2]) {
      const project = Project.empty(user.id);
      project.rename(`Project ${i}`);
      await repository.createProject(project);
    }

    const projects = await repository.findProjectsByUserId(user.id!);

    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.title.value)).toContain('Project 1');
    expect(projects.map((p) => p.title.value)).toContain('Project 2');
  });
});

describe('createProject', () => {
  it('should create a new project and link it to the user', async () => {
    const project = Project.empty(user.id);
    project.rename('New Project');

    await repository.createProject(project);

    const prisma = container.resolve<PrismaClient>(Token.PrismaClient);
    const entity = await prisma.project.findUnique({
      where: { id: project.id.value },
      include: { userProjects: true },
    });
    expect(entity).not.toBeNull();
    expect(entity?.title).toBe('New Project');
    expect(entity?.userProjects[0]?.userId).toBe(user.id);
  });
});

describe('updateProject', () => {
  it('should update project details and asset links', async () => {
    const assetRepository = container.resolve<IAssetRepository>(
      Token.AssetRepository
    );
    const assets = await Promise.all(
      ['a.txt', 'b.txt', 'c.txt'].map((file) => {
        const asset = new Asset({
          id: AssetId.generate().value,
          name: file,
          path: file,
        });
        return assetRepository.save(asset);
      })
    );

    const project = Project.empty(user.id);
    project.edit(
      '{}',
      assets.map((asset) => asset.id.value)
    );
    await repository.createProject(project);

    project.rename('Updated Title');
    project.edit(
      '{"updated": true}',
      assets.slice(1).map((asset) => asset.id.value)
    );

    await repository.updateProject(project);

    const prisma = container.resolve<PrismaClient>(Token.PrismaClient);
    const updatedDbProject = await prisma.project.findUnique({
      where: { id: project.id.value },
      include: { projectAssets: true },
    });
    expect(updatedDbProject?.title).toBe('Updated Title');

    const assetIds = updatedDbProject?.projectAssets
      .filter((pa) => !pa.deleteFlag)
      .map((pa) => pa.assetId);
    expect(assetIds).toHaveLength(2);
    expect(assetIds).toContain(assets[1].id.value);
    expect(assetIds).toContain(assets[2].id.value);
    expect(assetIds).not.toContain(assets[0].id.value);

    const deletedAssetLink = await prisma.projectAsset.findFirst({
      where: { projectId: project.id.value, assetId: assets[0].id.value },
    });
    expect(deletedAssetLink?.deleteFlag).toBe(true);
  });
});
