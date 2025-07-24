import { apiClient, IApiClient } from '@/lib/api';
import { PostProjectRequest } from '@/lib/api/types/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export class NewProjectRedirectPageController {
  constructor(
    private readonly router: AppRouterInstance,
    private readonly api: IApiClient = apiClient
  ) {}

  async createAndRedirect() {
    const request: PostProjectRequest = {};
    const response = await this.api.postProject(request);

    this.router.replace(`/projects/${response.projectId}/edit`);
  }
}
