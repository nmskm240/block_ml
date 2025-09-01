import { IProjectRepository, Project } from '@/domains/project';
import { ProjectId } from '@/domains/project/valueObjects';
import { User } from '@/domains/user';
import { ProjectNotFoundError } from '@/errors';
import { container, Token } from '@/lib/di';
import { generateTestUser } from '@/lib/jest/helper';

import { fetchProjectDetail } from '../actions';

let repository: IProjectRepository;
let user: User;

beforeEach(async () => {
  repository = container.resolve<IProjectRepository>(Token.ProjectRepository);
  user = await generateTestUser(container);
});

it('should fetch a project and return a project detail DTO', async () => {
  const project = Project.empty(user.id.value);

  await repository.create(project);

  const detail = await fetchProjectDetail(project.id.value);

  expect(detail.id).toBe(project.id.value);
  expect(detail.title).toBe(project.title.value);
  expect(detail.description).toBe(project.description.value);
  expect(detail.status).toBe(project.status);
  expect(detail.createdBy.id).toBe(project.ownerUserId!.value);
});

it('should throw an error if project not found', async () => {
  const projectId = ProjectId.generate().value;
  await expect(fetchProjectDetail(projectId)).rejects.toThrow(
    ProjectNotFoundError,
  );
});
