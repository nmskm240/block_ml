import { injectable } from 'tsyringe';
import { Project, ProjectStatus } from './domains';
import { PrismaClient } from '@/lib/prisma';
import { toDomain, toEntity } from './mapper';
import { InputJsonValue } from '@/lib/prisma/runtime/library';

export interface IProjectRepository {
  getProjectById(projectId: string): Promise<Project>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: Project): Promise<Project>;
  updateProject(project: Project): Promise<Project>;
}

@injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async getProjectById(projectId: string): Promise<Project> {
    const entity = await this._prisma.userProjectEntity.findFirstOrThrow({
      where: { projectId: projectId },
      include: { project: true },
    });
    return toDomain({
      ...entity.project,
      userId: entity.userId,
      projectId: entity.projectId,
    });
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    const entities = await this._prisma.userProjectEntity.findMany({
      where: { userId: userId },
      include: { project: true },
    });
    return entities.map((entity) =>
      toDomain({
        ...entity.project,
        userId: entity.userId,
        projectId: entity.projectId,
      })
    );
  }

  async createProject(project: Project): Promise<Project> {
    if (!project.ownerUserId) {
      throw new Error();
    }

    const entity = toEntity(project);
    const saved = await this._prisma.$transaction(async (tran) => {
      const projectEntity = await tran.projectEntity.create({
        data: {
          ...entity.project,
          workspaceJson: entity.project.workspaceJson as InputJsonValue,
        },
      });

      const userProjectEntity = await tran.userProjectEntity.create({
        data: { userId: project.ownerUserId!, projectId: projectEntity.id },
      });

      return { projectEntity, userProjectEntity };
    });

    return toDomain({
      ...saved.projectEntity,
      userId: saved.userProjectEntity.userId,
      projectId: saved.projectEntity.id,
    });
  }

  async updateProject(project: Project): Promise<Project> {
    if(!project.ownerUserId) {
      throw new Error();
    }

    const entity = toEntity(project);
    const updated = await this._prisma.projectEntity.update({
      where: { id: project.id },
      data: {
        ...entity.project,
        workspaceJson: entity.project.workspaceJson as InputJsonValue,
      },
    });

    return toDomain({
      ...updated,
      userId: project.ownerUserId!,
      projectId: updated.id,
    });
  }
}
