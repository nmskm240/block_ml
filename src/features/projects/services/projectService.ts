import { Token } from '@/lib/di/types';
import { inject, injectable } from 'tsyringe';
import type { IProjectRepository } from '../repositories';

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
    const project = await this._repository.findById(id);

    return project !== undefined;
  }
}
