import { injectable } from 'tsyringe';
import type { IProjectRepository } from '../repositories';

export interface IProjectService {
  isExist(id: string): Promise<boolean>;
}

@injectable()
export class ProjectService implements IProjectService {
  constructor(private readonly _repository: IProjectRepository) {}

  async isExist(id: string): Promise<boolean> {
    const project = await this._repository.findProjectById(id);

    return project !== undefined;
  }
}
