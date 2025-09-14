import { UserStatus } from '../userStatus';

it('should have correct enum values', () => {
  expect(UserStatus.None).toBe(0);
  expect(UserStatus.Active).toBe(1);
  expect(UserStatus.Deleted).toBe(2);
});
