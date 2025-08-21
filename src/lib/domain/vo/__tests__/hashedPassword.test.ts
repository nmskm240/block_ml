import { HashedPassword } from '../hashedPassword';

describe('HashedPassword', () => {
  describe('fromRaw', () => {
    it('should throw error if password is empty', () => {
      expect(() => HashedPassword.fromRaw('')).toThrow('Password must not be empty.');
    });

    it('should return HashedPassword instance if password is not empty', () => {
      const hashedPassword = HashedPassword.fromRaw('password');
      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).not.toBe('');
    });
  });
});