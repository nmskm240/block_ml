import {
  ProjectWorkspace,
  ProjectWorkspaceEmptyError,
} from '../projectWorkspace';

it('should throw error if workspaceJson is empty', () => {
  expect(() => new ProjectWorkspace(' ')).toThrow(ProjectWorkspaceEmptyError);
});
