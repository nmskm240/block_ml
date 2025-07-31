import { IProjectApiClient, ProjectApiClient } from '@/features/projects/api/client';
import { CreateProjectRequest } from '@/features/projects/api/types';

export class NewProjectRedirectPageController {
  constructor(
    private readonly api: IProjectApiClient = new ProjectApiClient()
  ) {}

  async createNewProject(): Promise<string | undefined> {
    const request: CreateProjectRequest = {};
    const response = await this.api.createProject(request);
    return response.project.id;
  }
}
