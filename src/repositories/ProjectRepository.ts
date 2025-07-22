import { PrismaClient, type Project } from '@/lib/prisma';
import { injectable } from 'tsyringe';

export interface IProjectRepository {
  getProjectById(projectId: string): Promise<Project>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  save(
    id: { userId: string; projectId: string },
    json: string
  ): Promise<Project>;
}

@injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async getProjectById(projectId: string): Promise<Project> {
    return await this._prisma.project.findFirstOrThrow({
      where: { id: projectId },
    });
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await this._prisma.project.findMany({
      where: { userProjects: { some: { userId: userId } } },
    });
  }
  async save(
    id: { userId: string; projectId: string },
    json: string
  ): Promise<Project> {
    if (!json || (!id.userId && !id.projectId)) {
      throw new Error();
    }

    const saved = await this._prisma.$transaction(async (tran) => {
      const saved = await tran.project.upsert({
        where: { id: id.projectId },
        create: { workspaceJson: json },
        update: { workspaceJson: json },
      });

      if (!id.projectId) {
        await tran.userProject.create({
          data: { userId: id.userId, projectId: saved.id },
        });
      }
      return saved;
    });
    return saved;
  }
}
