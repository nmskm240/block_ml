import { inject, injectable } from 'tsyringe';
import type { IUserRepository } from '../repositories';
import { Token } from '@/lib/di/types';

export interface IUserService {
  isExist(email: string): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Token.UserRepository) private readonly _repository: IUserRepository
  ) {}

  async isExist(email: string): Promise<boolean> {
    return (await this._repository.findByEmail(email)) != undefined;
  }
}
