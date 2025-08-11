import "reflect-metadata";
import { inject, injectable } from 'tsyringe';
import { type IUserRepository } from '../repositories';
import User from '../domains';
import bcrypt from 'bcrypt';
import { Token } from '@/lib/di/types';

export interface IAuthService {
  verify(email: string, password: string): Promise<User | null>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  async verify(email: string, password: string): Promise<User | null> {
    const user = await this._userRepository.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }
}
