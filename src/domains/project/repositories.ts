import { Project } from './entities';

export interface IProjectRepository {
  getById(projectId: string): Promise<Project>;
  findByUserId(userId: string): Promise<Project[]>;
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
}
