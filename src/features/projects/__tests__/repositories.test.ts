import 'reflect-metadata';
import { container } from 'tsyringe';
import { ProjectRepository } from '../repositories';
import { Token } from '@/lib/di/types';
import Project, { ProjectStatus } from '../domains';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient, User } from '@prisma/client';

// tsconfig.jsonのtypes設定により、jestPrismaはグローバルに型定義される

describe('ProjectRepository with jest-prisma', () => {
  let repository: ProjectRepository;
  let user: User;
  const prisma: PrismaClient = jestPrisma.client;

  beforeAll(() => {
    // DIコンテナに jest-prisma が提供する PrismaClient を登録
    container.register(Token.PrismaClient, { useValue: prisma });
    repository = container.resolve(ProjectRepository);
  });

  beforeEach(async () => {
    // 各テストの前に共通のユーザーを作成
    user = await prisma.user.create({
      data: {
        email: `test-${createId()}@example.com`,
        name: 'Test User',
      },
    });
  });

  describe('findProjectById', () => {
    it('should return a project if found', async () => {
      const projectData = await prisma.project.create({
        data: {
          title: 'Find Me',
          workspaceJson: '{}',
          status: ProjectStatus.Active,
          userProjects: {
            create: { userId: user.id },
          },
        },
      });

      const foundProject = await repository.findProjectById(projectData.id);

      expect(foundProject).toBeInstanceOf(Project);
      expect(foundProject?.id.value).toBe(projectData.id);
      expect(foundProject?.title.value).toBe('Find Me');
      expect(foundProject?.ownerUserId?.value).toBe(user.id);
    });

    it('should return undefined if not found', async () => {
      const foundProject = await repository.findProjectById(createId());
      expect(foundProject).toBeUndefined();
    });
  });

  describe('findProjectsByUserId', () => {
    it('should return all projects for a user', async () => {
      await prisma.project.create({
        data: {
          title: 'Project 1',
          workspaceJson: '{}',
          status: ProjectStatus.Active,
          userProjects: { create: { userId: user.id } },
        },
      });
      await prisma.project.create({
        data: {
          title: 'Project 2',
          workspaceJson: '{}',
          status: ProjectStatus.Draft,
          userProjects: { create: { userId: user.id } },
        },
      });

      const projects = await repository.findProjectsByUserId(user.id);

      expect(projects).toHaveLength(2);
      expect(projects.map(p => p.title.value)).toContain('Project 1');
      expect(projects.map(p => p.title.value)).toContain('Project 2');
    });
  });

  describe('createProject', () => {
    it('should create a new project and link it to the user', async () => {
      const projectDomain = new Project({
        id: createId(),
        title: 'New Project',
        workspaceJson: '{\"key\": \"value\"}',
        status: ProjectStatus.Draft,
        assetIds: [],
        ownerUserId: user.id,
      });

      const createdProject = await repository.createProject(projectDomain);

      expect(createdProject.title.value).toBe('New Project');

      const dbProject = await prisma.project.findUnique({ where: { id: createdProject.id.value }, include: { userProjects: true } });
      expect(dbProject).not.toBeNull();
      expect(dbProject?.title).toBe('New Project');
      expect(dbProject?.userProjects[0]?.userId).toBe(user.id);
    });
  });

  describe('updateProject', () => {
    it('should update project details and asset links', async () => {
      const asset1 = await prisma.asset.create({ data: { id: createId(), fileName: 'a.txt', filePath: 'a.txt' } });
      const asset2 = await prisma.asset.create({ data: { id: createId(), fileName: 'b.txt', filePath: 'b.txt' } });
      const asset3 = await prisma.asset.create({ data: { id: createId(), fileName: 'c.txt', filePath: 'c.txt' } });

      const initialProject = await prisma.project.create({
        data: {
          title: 'Initial Title',
          workspaceJson: '{}',
          status: ProjectStatus.Active,
          userProjects: { create: { userId: user.id } },
          projectAssets: { create: [{ assetId: asset1.id }, { assetId: asset2.id }] },
        },
      });

      const projectToUpdate = new Project({
        id: initialProject.id,
        title: 'Updated Title',
        workspaceJson: '{\"updated\": true}',
        status: ProjectStatus.Active,
        assetIds: [asset2.id, asset3.id], // asset1を除外し、asset3を追加
        ownerUserId: user.id,
      });

      await repository.updateProject(projectToUpdate);

      const updatedDbProject = await prisma.project.findUnique({ where: { id: initialProject.id }, include: { projectAssets: true } });
      expect(updatedDbProject?.title).toBe('Updated Title');

      const assetIds = updatedDbProject?.projectAssets.filter(pa => !pa.deleteFlag).map(pa => pa.assetId);
      expect(assetIds).toHaveLength(2);
      expect(assetIds).toContain(asset2.id);
      expect(assetIds).toContain(asset3.id);
      expect(assetIds).not.toContain(asset1.id);

      const deletedAssetLink = await prisma.projectAsset.findFirst({ where: { projectId: initialProject.id, assetId: asset1.id } });
      expect(deletedAssetLink?.deleteFlag).toBe(true);
    });
  });
});