import { injectable, inject } from 'tsyringe';
import type { IProjectRepository } from '../repositories';
import { Token } from '@/lib/di/types';

export interface IProjectService {
  isExist(id: string): Promise<boolean>;
}

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject(Token.ProjectRepository)
    private readonly _repository: IProjectRepository
  ) {}

  async isExist(id: string): Promise<boolean> {
    const project = await this._repository.findProjectById(id);

    return project !== undefined;
  }
}
