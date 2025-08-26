import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { Token } from '@/lib/di';

import { ProjectNotFoundError } from '../repositories';

import type { ProjectDetail } from '../types';

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
        name: createdBy.name ?? "",
        avatarUrl: createdBy.image ?? "",
      },
      assets: entity.projectAssets.map((e) => ({
        id: e.asset.id,
        name: e.asset.fileName,
        path: e.asset.filePath,
      })),
      updatedAt: entity.updatedAt,
    };
  }
}
