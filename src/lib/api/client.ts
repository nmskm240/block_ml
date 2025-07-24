import {
  PostProjectRequest,
  PostProjectResponse,
  PutProjectRequest,
  PutProjectResponse,
} from './types/api';

export interface IApiClient {
  postProject(request: PostProjectRequest): Promise<PostProjectResponse>;
  putProject(request: PutProjectRequest): Promise<PutProjectResponse>;
}

class ApiClient implements IApiClient {
  async putProject(request: PutProjectRequest): Promise<PutProjectResponse> {
    const data = new FormData();
    data.append('blocklyJson', request.blocklyJson);
    for (const file of request.files) {
      data.append('files', file, file.name);
    }

    const response = await fetch(`/api/projects/${request.projectId}`, {
      method: 'PUT',
      body: data,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to update project');
    }

    return (await response.json()) as PutProjectResponse;
  }

  async postProject(request: PostProjectRequest): Promise<PostProjectResponse> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to save project');
    }

    return (await response.json()) as PostProjectResponse;
  }
}

export const apiClient = new ApiClient();
