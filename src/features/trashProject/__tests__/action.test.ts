import { createId } from '@paralleldrive/cuid2';

import { IProjectRepository, Project } from '@/domains/project';
import { ProjectStatus } from '@/domains/project/valueObjects';
import { User } from '@/domains/user';
import {
  ForbiddenError,
  ProjectNotFoundError,
  UnauthorizedError,
} from '@/errors';
import { container, Token } from '@/lib/di';
import { generateTestUser, updateSession } from '@/lib/jest/helper';

import { trashProject } from '../action';

let user: User;
let projectRepository: IProjectRepository;

beforeEach(async () => {
  projectRepository = container.resolve<IProjectRepository>(
    Token.ProjectRepository,
  );
  user = await generateTestUser();
});

it('should trash a project successfully', async () => {
  const project = Project.empty(user.id.value);
  await projectRepository.create(project);

  updateSession({ user: { id: user.id.value }, expires: '' });

  await trashProject(project.id.value);

  const trashedProject = await projectRepository.getById(project.id.value);
  expect(trashedProject?.status).toBe(ProjectStatus.Trashed);
});

it('should throw ProjectNotFoundError when trying to trash a non-existent project', async () => {
  const nonExistentProjectId = createId();
  updateSession({ user: { id: user.id.value }, expires: '' });
  await expect(trashProject(nonExistentProjectId)).rejects.toThrow(
    ProjectNotFoundError,
  );
});

it('should throw UnauthorizedError if user is not authenticated', async () => {
  const project = Project.empty(user.id.value);
  await projectRepository.create(project);

  updateSession(null);

  await expect(trashProject(project.id.value)).rejects.toThrow(
    UnauthorizedError,
  );
});

it('should throw ForbiddenError if user is not the owner of the project', async () => {
  const otherUser = await generateTestUser();
  const project = Project.empty(otherUser.id.value);
  await projectRepository.create(project);

  updateSession({ user: { id: user.id.value }, expires: '' });

  await expect(trashProject(project.id.value)).rejects.toThrow(
    ForbiddenError,
  );
});
