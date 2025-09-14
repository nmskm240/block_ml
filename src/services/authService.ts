import { inject, injectable } from 'tsyringe';

import { User, type IUserRepository } from '@/domains/user';
import { Token } from '@/lib/di/types';

export interface IAuthService {
  verify(email: string, password: string): Promise<User | null>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async verify(email: string, password: string): Promise<User | null> {
    const user = await this._userRepository.findByEmail(email);
    if (!user || !user.hashedPassword.value) {
      return null;
    }

    const isValid = user.hashedPassword.compare(password);
    if (!isValid) {
      return null;
    }

    return user;
  }
}
