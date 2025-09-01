import { IProjectRepository, Project } from '@/domains/project';
import { User } from '@/domains/user';
import { container, Token } from '@/lib/di';
import { generateTestUser } from '@/lib/jest/helper';
import { ProjectSearchQuery } from '@/services';

import { searchProject } from '../actions';

let user: User;
let projectRepository: IProjectRepository;

beforeEach(async () => {
  projectRepository = container.resolve(Token.ProjectRepository);
  user = await generateTestUser();

  const project1 = Project.empty(user.id.value);
  project1.rename('Test Project 1');
  await projectRepository.create(project1);

  const project2 = Project.empty(user.id.value);
  project2.rename('Another Project');
  await projectRepository.create(project2);
});

it('should return projects matching the keyword', async () => {
  const query: ProjectSearchQuery = { keyword: 'Test' };
  const results = await searchProject(query);

  expect(results).toHaveLength(1);
  expect(results[0].title).toBe('Test Project 1');
});

it('should return all projects if keyword is empty', async () => {
  const query: ProjectSearchQuery = { keyword: '' };
  const results = await searchProject(query);

  expect(results).toHaveLength(2);
});

it('should return projects for a specific user', async () => {
  const otherUser = await generateTestUser();
  const project3 = Project.empty(otherUser.id.value);
  project3.rename('Other user project');
  await projectRepository.create(project3);

  const query: ProjectSearchQuery = { userId: user.id.value };
  const results = await searchProject(query);

  expect(results).toHaveLength(2);
  expect(results.every((p) => p.createdBy.id === user.id.value)).toBe(true);
});
