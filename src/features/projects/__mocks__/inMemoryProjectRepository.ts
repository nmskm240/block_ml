import Project, { ProjectStatus } from '../domains';
import { IProjectRepository } from '../repositories';
import { createId } from '@paralleldrive/cuid2';

export default class InMemoryProjectRepository implements IProjectRepository {
  private projects: Project[] = [];

  constructor(initialProjects: Project[] = []) {
    this.projects = initialProjects;
  }

  async findProjectById(projectId: string): Promise<Project | undefined> {
    const found = this.projects.find((p) => p.id.value === projectId);
    // InMemoryなので、関連エンティティのモックは簡略化
    if (found && found.ownerUserId) {
        return found; // ownerUserIdがある場合はそのまま返す
    } else if (found && !found.ownerUserId) {
        // ownerUserIdがない場合はisTemporaryがtrueになるので、そのまま返す
        return found;
    } else {
        return undefined;
    }
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    return this.projects.filter((p) => p.ownerUserId?.value === userId);
  }

  async createProject(project: Project): Promise<Project> {
    if (project.isTemporary) {
      throw new Error('Project must have an ownerUserId');
    }
    // IDが重複しないように新しいIDを割り当てる（テスト用）
    const newProject = new Project({
        id: createId(),
        title: project.title.value,
        workspaceJson: project.workspaceJson.value,
        status: project.status,
        assetIds: project.assetIds.map(a => a.value),
        ownerUserId: project.ownerUserId?.value,
        updatedAt: project.updatedAt,
    });
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(project: Project): Promise<Project> {
    const index = this.projects.findIndex((p) => p.id.value === project.id.value);
    if (index === -1) {
      throw new Error('Project not found');
    }
    // InMemoryなので、assetIdsの更新ロジックは簡略化
    const updatedProject = new Project({
        id: project.id.value,
        title: project.title.value,
        workspaceJson: project.workspaceJson.value,
        status: project.status,
        assetIds: project.assetIds.map(a => a.value),
        ownerUserId: project.ownerUserId?.value,
        updatedAt: new Date(), // 更新日時を更新
    });
    this.projects[index] = updatedProject;
    return updatedProject;
  }

  // テスト用のヘルパーメソッド
  clear() {
    this.projects = [];
  }

  add(project: Project) {
    this.projects.push(project);
  }
}
