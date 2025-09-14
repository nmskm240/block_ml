import { IProjectRepository } from '@/domains/project';
import { User } from '@/domains/user';
import { container, Token } from '@/lib/di';
import { generateTestUser, updateSession } from '@/lib/jest/helper';

import { createProject } from '../actions';

let user: User;
let projectRepository: IProjectRepository;

beforeEach(async () => {
  projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository,
  );
  user = await generateTestUser(container);
  updateSession({ user: { id: user.id.value }, expires: '' });
});

it('should create a new project with a default title', async () => {
  const { projectId } = await createProject();
  const project = await projectRepository.getById(projectId);

  expect(project).not.toBeNull();
  expect(project?.ownerUserId?.value).toBe(user.id.value);
  expect(project?.title.value).toBe('Untitled');
  expect(project?.description.value).toBe('');
});
