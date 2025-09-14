import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { ProjectNotFoundError } from '@/errors';
import { Token } from '@/lib/di';

import type {
  AssetInfo,
  ProjectMetadata,
  ProjectSearchQuery,
  ProjectSummary,
} from './types';

@injectable()
export class ProjectQueryService {
  constructor(
    @inject(Token.PrismaClient)
    private readonly _prisma: PrismaClient,
  ) {}

  async fetchProjectMetadata(projectId: string): Promise<ProjectMetadata> {
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
      workspace: JSON.stringify(entity.workspaceJson),
      status: entity.status,
      createdBy: {
        id: createdBy.id,
        name: createdBy.name ?? '',
        avatarUrl: createdBy.image ?? '',
      },
      assets: entity.projectAssets.map((e) => ({
        id: e.asset.id,
        name: e.asset.fileName,
      })),
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
        projectAssets: { include: { asset: true } },
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
      assets: entity.projectAssets.map<AssetInfo>((e) => ({
        id: e.asset.id,
        name: e.asset.fileName,
      })),
      updatedAt: entity.updatedAt,
    }));
  }
}
