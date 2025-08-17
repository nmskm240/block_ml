import 'reflect-metadata';
import { container } from 'tsyringe';
import { ProjectService } from '../services/projectService';
import { Token } from '@/lib/di/types';
import Project from '../domains';
import { createId } from '@paralleldrive/cuid2';

// モックリポジトリ
import InMemoryProjectRepository from '../__mocks__/inMemoryProjectRepository';

let service: ProjectService;
let inMemoryRepository: InMemoryProjectRepository;

beforeEach(() => {
  container.clearInstances();
  inMemoryRepository = new InMemoryProjectRepository();
  container.register(Token.ProjectRepository, {
    useValue: inMemoryRepository,
  });
  service = container.resolve(ProjectService);
});

describe('isExist', () => {
  it('should return true if project exists', async () => {
    const projectId = createId();
    inMemoryRepository.add(
      new Project({
        id: projectId,
        title: 'Test',
        workspaceJson: '{}',
        status: 1,
        assetIds: [],
      })
    );

    const result = await service.isExist(projectId);

    expect(result).toBe(true);
  });

  it('should return false if project does not exist', async () => {
    const projectId = createId();

    const result = await service.isExist(projectId);

    expect(result).toBe(false);
  });
});
