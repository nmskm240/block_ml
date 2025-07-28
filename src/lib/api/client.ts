import {
  GetUserRequest,
  GetUserResponse,
  PostProjectRequest,
  PostProjectResponse,
  PutProjectRequest,
  PutProjectResponse,
} from './types/api';

export interface IApiClient {
  postProject(request: PostProjectRequest): Promise<PostProjectResponse>;
  putProject(request: PutProjectRequest): Promise<PutProjectResponse>;

  getUser(request: GetUserRequest): Promise<GetUserResponse>;
}

class ApiClient implements IApiClient {
  async putProject(request: PutProjectRequest): Promise<PutProjectResponse> {
    const data = new FormData();
    data.append('blocklyJson', request.blocklyJson);
    for (const file of request.files) {
      data.append('files', file, file.name);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${request.projectId}`,
      {
        method: 'PUT',
        body: data,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to update project');
    }

    return (await response.json()) as PutProjectResponse;
  }

  async postProject(request: PostProjectRequest): Promise<PostProjectResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to save project');
    }

    return (await response.json()) as PostProjectResponse;
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${request.userId}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to get user');
    }
    return (await response.json()) as GetUserResponse;
  }
}

export const apiClient = new ApiClient();
