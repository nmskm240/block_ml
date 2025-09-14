import {
  UserName,
  UserNameEmptyError,
  UserNameTooLongError,
} from '../userName';

it('should throw an error if name is empty', () => {
  expect(() => new UserName('')).toThrow(UserNameEmptyError);
});

it('should throw an error if name is over 100 characters', () => {
  const longName = 'a'.repeat(101);
  expect(() => new UserName(longName)).toThrow(UserNameTooLongError);
});
