import { Token } from '@/lib/di/types';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';
import 'reflect-metadata';
import { container } from 'tsyringe';
import InMemoryUserRepository from '../__mocks__/inMemoryUserRepository';
import User, { UserStatus } from '../domains';
import { AuthService } from '../services/authService';

describe('AuthService', () => {
  let service: AuthService;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    container.clearInstances();
    inMemoryUserRepository = new InMemoryUserRepository();
    container.register(Token.UserRepository, {
      useValue: inMemoryUserRepository,
    });
    service = container.resolve(AuthService);
    jest.clearAllMocks();
  });

  describe('verify', () => {
    const email = 'test@example.com';
    const password = 'plain_password';

    it('should return user if email and password are valid', async () => {
      const user = new User(
        'Test User',
        email,
        password, // 平文パスワードを渡す
        UserStatus.Active,
        createId()
      );
      inMemoryUserRepository.add(user);

      const result = await service.verify(email, password);

      expect(result).toEqual(user);
      expect(await bcrypt.compare(password, user.hashedPassword)).toBe(true);
    });

    it('should return null if user not found', async () => {
      const result = await service.verify(email, password);

      expect(result).toBeNull();
    });

    

    it('should return null if password does not match', async () => {
      const user = new User(
        'Test User',
        email,
        password, // 平文パスワードを渡す
        UserStatus.Active,
        createId()
      );
      inMemoryUserRepository.add(user);

      const result = await service.verify(email, "wrong_password");

      expect(result).toBeNull();
    });
  });
});
