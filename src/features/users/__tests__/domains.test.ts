import { createId } from '@paralleldrive/cuid2';
import User, { UserId, UserStatus } from '../domains';

describe('User', () => {
  const baseParams = {
    id: createId(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'plain_password', // 平文パスワードに変更
    status: UserStatus.Active,
  };

  describe('constructor', () => {
    it('should create a user instance with an id', () => {
      const user = new User(
        baseParams.name,
        baseParams.email,
        baseParams.password,
        baseParams.status,
        baseParams.id
      );
      expect(user.id).toBe(baseParams.id);
      expect(user.name).toBe(baseParams.name);
      expect(user.email).toBe(baseParams.email);
      expect(user.hashedPassword).toMatch(/^\$2[aby]\$/); // ハッシュ形式であることを確認
      expect(user.status).toBe(UserStatus.Active);
    });

    it('should create a user instance without an id', () => {
      const user = new User(
        baseParams.name,
        baseParams.email,
        baseParams.password,
        baseParams.status
      );
      expect(user.id).toBeUndefined();
    });
  });

  describe('static new', () => {
    it('should create a new user with Active status', () => {
      const user = User.new(
        baseParams.name,
        baseParams.email,
        baseParams.password
      );
      expect(user.status).toBe(UserStatus.Active);
      expect(user.name).toBe(baseParams.name);
    });
  });

  describe('copyWith', () => {
    it('should copy a user with updated properties', () => {
      const user = new User(
        baseParams.name,
        baseParams.email,
        baseParams.password,
        baseParams.status,
        baseParams.id
      );
      const updatedUser = user.copyWith({
        name: 'Updated Name',
        status: UserStatus.Deleted,
      });

      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.status).toBe(UserStatus.Deleted);
    });
  });

  describe('UserName (ValueObject)', () => {
    it('should throw an error if name is empty', () => {
      expect(
        () =>
          new User('', baseParams.email, baseParams.password, baseParams.status)
      ).toThrow('User name must not be empty.');
    });

    it('should throw an error if name is over 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(
        () =>
          new User(
            longName,
            baseParams.email,
            baseParams.password,
            baseParams.status
          )
      ).toThrow('User name must be 100 characters or less.');
    });
  });

  describe('UserId (ValueObject)', () => {
    it('should be a valid CUID', () => {
      const userId = new UserId(createId());
      expect(userId.value).toMatch(/^[a-z0-9]{24,}$/);
    });
  });
});
