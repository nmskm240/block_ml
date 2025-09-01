import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { ProjectNotFoundError } from '@/errors';
import { Token } from '@/lib/di';

import type {
  ProjectDetail,
  ProjectSearchQuery,
  ProjectSummary,
} from './types';

@injectable()
export class ProjectQueryService {
  constructor(
    @inject(Token.PrismaClient)
    private readonly _prisma: PrismaClient,
  ) {}

  async fetchProjectDetail(projectId: string): Promise<ProjectDetail> {
    const entity = await this._prisma.project.findFirst({
      where: { id: projectId },
      include: {
        userProjects: { include: { user: true } },
        projectAssets: { include: { asset: true } },
      },
    });

    if (!entity || entity.userProjects.length == 0) {
      throw new ProjectNotFoundError(projectId);
    }

    const createdBy = entity.userProjects[0].user;

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdBy: {
        id: createdBy.id,
        name: createdBy.name ?? '',
        avatarUrl: createdBy.image ?? '',
      },
      assets: entity.projectAssets.map((e) => ({
        id: e.asset.id,
        name: e.asset.fileName,
        path: e.asset.filePath,
      })),
      updatedAt: entity.updatedAt,
    };
  }

  async fetchProjectSummary(projectId: string): Promise<ProjectSummary> {
    const entity = await this._prisma.project.findFirst({
      where: { id: projectId },
      include: {
        userProjects: { include: { user: true } },
        projectAssets: { include: { asset: true } },
      },
    });

    if (!entity || entity.userProjects.length == 0) {
      throw new ProjectNotFoundError(projectId);
    }

    const createdBy = entity.userProjects[0].user;

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdBy: {
        id: createdBy.id,
        name: createdBy.name ?? '',
        avatarUrl: createdBy.image ?? '',
      },
      updatedAt: entity.updatedAt,
    };
  }

  async search(query: ProjectSearchQuery): Promise<ProjectSummary[]> {
    const entities = await this._prisma.project.findMany({
      where: {
        AND: [
          { title: { contains: query.keyword } },
          { userProjects: { some: { userId: query.userId } } },
        ],
      },
      include: {
        userProjects: { include: { user: true }, take: 1 },
      },
      skip: query.offset,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    });

    return entities.map((entity) => ({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdBy: {
        id: entity.userProjects[0]?.user.id ?? '',
        name: entity.userProjects[0]?.user.name ?? '',
        avatarUrl: entity.userProjects[0]?.user.image ?? '',
      },
      updatedAt: entity.updatedAt,
    }));
  }
}
