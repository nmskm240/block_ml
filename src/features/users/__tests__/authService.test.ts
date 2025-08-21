import { Token } from '@/lib/di/types';
import bcrypt from 'bcryptjs';
import 'reflect-metadata';
import container from '@/lib/di/container';
import User from '../domains';
import { IAuthService } from '../services/authService';
import { IUserRepository } from '../repositories';

let service: IAuthService;
let repository: IUserRepository;

beforeEach(() => {
  repository = container.resolve(Token.UserRepository);
  service = container.resolve(Token.AuthService);
});

describe('verify', () => {
  const email = 'test@example.com';
  const password = 'plain_password';

  it('should return user if email and password are valid', async () => {
    const user = User.new({
      name: 'Test User',
      email,
      password,
    });
    await repository.create(user);

    const result = await service.verify(email, password);

    expect(result).toEqual(user);
    expect(await bcrypt.compare(password, user.hashedPassword.value)).toBe(
      true
    );
  });

  it('should return null if user not found', async () => {
    const result = await service.verify(email, password);

    expect(result).toBeNull();
  });

  it('should return null if password does not match', async () => {
    const user = User.new({
      name: 'Test User',
      email,
      password,
    });
    await repository.create(user);

    const result = await service.verify(email, 'wrong_password');

    expect(result).toBeNull();
  });
});
