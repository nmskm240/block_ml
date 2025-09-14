import { IUserRepository } from '@/domains/user';
import { container, Token } from '@/lib/di';

import { signUp } from '../action';
import { UserAlreadySignUpEmailError } from '../errors';
import { SignUpParams } from '../types';

let userRepository: IUserRepository;

beforeEach(() => {
  userRepository = container.resolve<IUserRepository>(Token.UserRepository);
});

describe('signUp action', () => {
  const validParams: SignUpParams = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should create a new user with valid data', async () => {
    await signUp(validParams);

    const user = await userRepository.findByEmail(validParams.email);
    expect(user).not.toBeNull();
    expect(user?.name.value).toBe(validParams.name);
    expect(user?.email.value).toBe(validParams.email);
  });

  it('should throw UserAlreadySignUpEmailError if email already exists', async () => {
    await signUp(validParams); // first time
    await expect(signUp(validParams)).rejects.toThrow(
      UserAlreadySignUpEmailError,
    );
  });

  it('should throw a validation error for invalid email', async () => {
    const invalidParams = { ...validParams, email: 'invalid' };
    await expect(signUp(invalidParams)).rejects.toThrow();
  });

  it('should throw a validation error for short password', async () => {
    const invalidParams = { ...validParams, password: '123' };
    await expect(signUp(invalidParams)).rejects.toThrow();
  });

  it('should throw a validation error for empty name', async () => {
    const invalidParams = { ...validParams, name: '' };
    await expect(signUp(invalidParams)).rejects.toThrow();
  });
});
