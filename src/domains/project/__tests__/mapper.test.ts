import { createId } from '@paralleldrive/cuid2';

import { Project } from '../entities';
import { toDomain, toEntity } from '../mapper';
import { ProjectStatus } from '../valueObjects';

const userId = createId();
const projectId = createId();
const assetId = createId();

describe('toDomain', () => {
  it('should map a complex entity to a Project domain object', () => {
    const domain = toDomain({
      project: {
        id: projectId,
        title: 'Test Project',
        description: 'description',
        workspaceJson: { blocks: {} }, // Prisma Json type
        status: ProjectStatus.Active,
      },
      userProject: {
        userId: userId,
        projectId: projectId,
      },
      projectAssets: [
        {
          projectId: projectId,
          assetId: assetId,
          deleteFlag: false,
        },
      ],
    });

    expect(domain).toBeInstanceOf(Project);
    expect(domain.id.value).toBe(projectId);
    expect(domain.ownerUserId?.value).toBe(userId);
    expect(domain.title.value).toBe('Test Project');
    expect(domain.workspace.value).toBe(JSON.stringify({ blocks: {} }));
    expect(domain.assetIds.map((id) => id.value)).toEqual([assetId]);
    expect(domain.status).toBe(ProjectStatus.Active);
  });
});

describe('toEntity', () => {
  it('should map a Project domain object to a complex entity', () => {
    const domain = new Project({
      id: projectId,
      title: 'Domain Project',
      description: 'description',
      workspaceJson: '{"key":"value"}',
      status: ProjectStatus.Draft,
      assetIds: [assetId],
      ownerUserId: userId,
    });

    const { project, userProject, projectAssets } = toEntity(domain);

    expect(project.id).toBe(projectId);
    expect(project.title).toBe('Domain Project');
    expect(project.description).toBe('description');
    expect(project.workspaceJson).toBe('{"key":"value"}');
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
      description: '',
      workspaceJson: '{}',
      status: ProjectStatus.Draft,
      assetIds: [],
    });

    expect(() => toEntity(temporaryProject)).toThrow();
  });
});
