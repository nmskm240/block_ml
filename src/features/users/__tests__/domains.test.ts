import 'reflect-metadata';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';

import { User, UserId, UserName, UserStatus } from '@/features/users';

describe('constructor', () => {
  it('should create a user instance with an id', () => {
    const params = {
      id: UserId.generate().value,
      name: 'Test user',
      email: 'hoge@example.com',
      hashedPassword: bcrypt.hashSync('password'),
      status: UserStatus.Active,
    };
    const user = new User(params);
    expect(user.id.value).toBe(params.id);
    expect(user.name.value).toBe(params.name);
    expect(user.email.value).toBe(params.email);
    expect(user.hashedPassword.value).toMatch(/^\$2[aby]\$/); // ハッシュ形式であることを確認
    expect(user.status).toBe(UserStatus.Active);
  });
});

describe('static new', () => {
  it('should create a new user with Active status', () => {
    const user = User.new({
      name: 'Test user',
      email: 'hoge@example.com',
      password: 'password',
    });
    expect(user.id).not.toBeUndefined();
    expect(user.name.value).toBe('Test user');
    expect(user.email.value).toBe('hoge@example.com');
    expect(user.status).toBe(UserStatus.Active);
    expect(user.hashedPassword.compare('password')).toBe(true);
  });
});

describe('UserName', () => {
  it('should throw an error if name is empty', () => {
    expect(() => new UserName('')).toThrow('User name must not be empty.');
  });

  it('should throw an error if name is over 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => new UserName(longName)).toThrow(
      'User name must be 100 characters or less.',
    );
  });
});

describe('UserId', () => {
  it('should be a valid CUID', () => {
    const userId = new UserId(createId());
    expect(userId.value).toMatch(/^[a-z0-9]{24,}$/);
  });
});
