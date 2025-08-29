import {
  ProjectTitle,
  ProjectTitleEmptyError,
  ProjectTitleTooLongError,
} from '../projectTitle';

it('should throw error if title is empty', () => {
  expect(() => new ProjectTitle('')).toThrow(ProjectTitleEmptyError);
});

it('should throw error if title is over 100 characters', () => {
  const longTitle = 'a'.repeat(101);
  expect(() => new ProjectTitle(longTitle)).toThrow(ProjectTitleTooLongError);
});

it('should trim the title', () => {
  const title = new ProjectTitle('  Trimmed Title  ');
  expect(title.value).toBe('Trimmed Title');
});
