import {
  IProjectApiClient,
  ProjectApiClient,
} from '@/features/projects/api/client';
import { ProjectSummaryDto } from '@/features/projects/types';

export class UserPageController {
  constructor(
    private readonly _userId: string,
    private readonly _api: IProjectApiClient = new ProjectApiClient()
  ) {}

  async fetchProjectSummaries(): Promise<ProjectSummaryDto[]> {
    const response = await this._api.getProjects({ userId: this._userId });
    return response.projects;
  }
}
