import 'reflect-metadata';
import container from '@/lib/di/container';
import { IProjectService } from '../services/projectService';
import { Token } from '@/lib/di/types';
import Project from '../domains';
import { IProjectRepository } from '../repositories';
import User from '@/features/users/domains';
import { generateTestUser } from '@/lib/prisma/__tests__/test-helper';

let service: IProjectService;
let repository: IProjectRepository;
let user: User;

beforeEach(async () => {
  service = container.resolve<IProjectService>(Token.ProjectService);
  repository = container.resolve<IProjectRepository>(Token.ProjectRepository);
  user = await generateTestUser(container);
});

describe('isExist', () => {
  it('should return true if project exists', async () => {
    const project = Project.empty(user.id.value);
    await repository.create(project);

    const result = await service.isExist(project.id.value);

    expect(result).toBe(true);
  });

  it('should return false if project does not exist', async () => {
    const result = await service.isExist('hoge');

    expect(result).toBe(false);
  });
});
