import {
  ProjectDescription,
  ProjectDescriptionTooLongError,
} from '../projectDescription';

it('should throw error if description is over 500 characters', () => {
  const longDescription = 'a'.repeat(501);
  expect(() => new ProjectDescription(longDescription)).toThrow(
    ProjectDescriptionTooLongError,
  );
});

it('should not throw error if description is 500 characters or less', () => {
  const validDescription = 'a'.repeat(500);
  expect(() => new ProjectDescription(validDescription)).not.toThrow();
});
