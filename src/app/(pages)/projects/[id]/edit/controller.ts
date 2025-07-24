import { apiClient, IApiClient } from '@/lib/api';
import { PutProjectRequest } from '@/lib/api/types/api';

export class ProjectEditPageController {
  constructor(
    private readonly projectId: string,
    private readonly api: IApiClient = apiClient
  ) {}

  // TODO: projectはクライアント側専用の型があってもいいかもしれない
  async saveProject(
    json: {
      [key: string]: any;
    },
    files: File[]
  ) {
    const request: PutProjectRequest = {
      projectId: this.projectId,
      blocklyJson: JSON.stringify(json),
      files: files,
    };
    await this.api.putProject(request);
  }
}
