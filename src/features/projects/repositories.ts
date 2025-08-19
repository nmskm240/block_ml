import { Token } from '@/lib/di/types';
import { Prisma, PrismaClient } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import Project from './domains';
import { toDomain, toEntity } from './mapper';
import { ProjectSearchQuery } from './types';

export interface IProjectRepository {
  findById(projectId: string): Promise<Project | undefined>;
  findByUserId(userId: string): Promise<Project[]>;
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  search(query: ProjectSearchQuery): Promise<Project[]>;
}

@injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @inject(Token.PrismaClient)
    private readonly _client: PrismaClient | Prisma.TransactionClient
  ) {}

  async findById(projectId: string): Promise<Project | undefined> {
    const entity = await this._client.project.findFirst({
      where: { id: projectId },
      include: {
        userProjects: true,
        projectAssets: {
          include: { asset: true },
          where: { deleteFlag: false },
        },
      },
    });

    if (!entity) {
      return undefined;
    }

    if (entity.userProjects.length == 0) {
      // 紐づけされていないプロジェクト（存在しないはず）
      console.warn('Project has no associated userProject');
      return undefined;
    }

    return toDomain({
      project: {
        id: entity.id,
        title: entity.title,
        status: entity.status,
        workspaceJson: entity.workspaceJson,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        statusUpdatedAt: entity.statusUpdatedAt,
      },
      userProject: entity.userProjects[0],
      projectAssets: entity.projectAssets.map((e) => e),
    });
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const entities = await this._client.userProject.findMany({
      where: { userId: userId },
      include: {
        project: {
          include: {
            projectAssets: {
              include: { asset: true },
              where: { deleteFlag: false },
            },
          },
        },
      },
    });

    return entities.map((entity) =>
      toDomain({
        project: entity.project,
        userProject: {
          userId: entity.userId,
          projectId: entity.projectId,
        },
        projectAssets: entity.project.projectAssets.map((e) => e),
      })
    );
  }

  async create(project: Project): Promise<Project> {
    if (project.isTemporary) {
      throw new Error('Project must have an ownerUserId');
    }

    const entity = toEntity(project);
    const projectEntity = await this._client.project.create({
      data: {
        id: project.id.value,
        title: entity.project.title,
        workspaceJson: entity.project.workspaceJson as InputJsonValue,
        status: entity.project.status,
      },
    });

    entity.userProject.projectId = projectEntity.id;
    entity.projectAssets.forEach((e) => (e.projectId = projectEntity.id));

    await this._client.userProject.create({
      data: { userId: project.ownerUserId!.value, projectId: projectEntity.id },
    });

    if (entity.projectAssets.length > 0) {
      await this._client.projectAsset.createMany({
        data: [...entity.projectAssets],
      });
    }

    return toDomain({
      project: projectEntity,
      userProject: entity.userProject,
      projectAssets: entity.projectAssets,
    });
  }

  async update(project: Project): Promise<Project> {
    if (!project.ownerUserId) {
      throw new Error('Project must have an ownerUserId');
    }

    const entity = toEntity(project);
    const updatedProjectEntity = await this._client.project.update({
      where: { id: project.id.value },
      data: {
        ...entity.project,
        workspaceJson: entity.project.workspaceJson as InputJsonValue,
      },
    });

    const existingLinks = await this._client.projectAsset.findMany({
      where: { projectId: project.id.value },
    });
    const existingIds = new Set(existingLinks.map((e) => e.assetId));
    const incomingIds = new Set(project.assetIds.map((a) => a.value));

    const existings = [...existingIds].filter((id) => !incomingIds.has(id));
    const incomings = [...incomingIds].filter((id) => !existingIds.has(id));

    if (existings.length > 0) {
      await this._client.projectAsset.updateMany({
        where: {
          projectId: project.id.value,
          assetId: { in: existings },
        },
        data: { deleteFlag: true },
      });
    }

    if (incomings.length > 0) {
      await this._client.projectAsset.createMany({
        data: incomings.map((id) => ({
          projectId: project.id.value,
          assetId: id,
          deleteFlag: false,
        })),
        skipDuplicates: true,
      });
    }

    const updatedAssets = await this._client.projectAsset.findMany({
      where: { projectId: project.id.value, deleteFlag: false },
      include: { asset: true },
    });

    return toDomain({
      project: updatedProjectEntity,
      userProject: {
        userId: project.ownerUserId.value,
        projectId: updatedProjectEntity.id,
      },
      projectAssets: updatedAssets.map((e) => e),
    });
  }

  
}