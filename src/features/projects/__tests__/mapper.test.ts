import { toDomain, toEntity } from '../mapper';
import Project, { ProjectStatus } from '../domains';
import { createId } from '@paralleldrive/cuid2';
import { Project as ProjectEntity, UserProject as UserProjectEntity, ProjectAsset as ProjectAssetEntity } from '@prisma/client';

describe('ProjectMapper', () => {
  const userId = createId();
  const projectId = createId();
  const assetId = createId();

  describe('toDomain', () => {
    it('should map a complex entity to a Project domain object', () => {
      const entity = {
        project: {
          id: projectId,
          title: 'Test Project',
          workspaceJson: { blocks: {} }, // Prisma Json type
          status: ProjectStatus.Active,
          statusUpdatedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ProjectEntity,
        userProject: {
          userId: userId,
          projectId: projectId,
        } as UserProjectEntity,
        projectAssets: [
          { projectId: projectId, assetId: assetId, deleteFlag: false } as ProjectAssetEntity,
        ],
      };

      const domain = toDomain(entity);

      expect(domain).toBeInstanceOf(Project);
      expect(domain.id.value).toBe(projectId);
      expect(domain.ownerUserId?.value).toBe(userId);
      expect(domain.title.value).toBe('Test Project');
      expect(domain.workspaceJson.value).toBe(JSON.stringify({ blocks: {} }));
      expect(domain.assetIds.map(id => id.value)).toEqual([assetId]);
      expect(domain.status).toBe(ProjectStatus.Active);
    });
  });

  describe('toEntity', () => {
    it('should map a Project domain object to a complex entity', () => {
      const domain = new Project({
        id: projectId,
        title: 'Domain Project',
        workspaceJson: '{\"key\":\"value\"}',
        status: ProjectStatus.Draft,
        assetIds: [assetId],
        ownerUserId: userId,
      });

      const { project, userProject, projectAssets } = toEntity(domain);

      expect(project.id).toBe(projectId);
      expect(project.title).toBe('Domain Project');
      expect(project.workspaceJson).toBe('{\"key\":\"value\"}');
      expect(project.status).toBe(ProjectStatus.Draft);

      expect(userProject.userId).toBe(userId);
      expect(userProject.projectId).toBe(projectId);

      expect(projectAssets).toHaveLength(1);
      expect(projectAssets[0].assetId).toBe(assetId);
      expect(projectAssets[0].projectId).toBe(projectId);
    });

    it('should throw an error if the project is temporary', () => {
        // ownerUserIdがないプロジェクトは一時的とみなされる
        const temporaryProject = new Project({
            id: projectId,
            title: 'Temporary',
            workspaceJson: '{}',
            status: ProjectStatus.Draft,
            assetIds: [],
        });

        expect(() => toEntity(temporaryProject)).toThrow();
    });
  });
});
