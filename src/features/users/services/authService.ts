import { Token } from '@/lib/di/types';
import bcrypt from 'bcryptjs';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from '../domains';
import { type IUserRepository } from '../repositories';

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
    if (!user || !user.hashedPassword) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return null;
    }

    return user;
  }
}
