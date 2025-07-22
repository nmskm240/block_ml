import { SaveProjectRequest, SaveProjectResponse } from './types/api';

export interface IApiClient {
  postSaveProject(request: SaveProjectRequest): Promise<SaveProjectResponse>;
}

class ApiClient implements IApiClient {
  async postSaveProject(
    request: SaveProjectRequest
  ): Promise<SaveProjectResponse> {
    const response = await fetch('/api/project', {
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

    return (await response.json()) as SaveProjectResponse;
  }
}

export const apiClient = new ApiClient();
