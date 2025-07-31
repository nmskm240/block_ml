import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectsRequest,
  GetProjectsResponse,
  SaveProjectRequest,
  SaveProjectResponse,
} from './types';

export interface IProjectApiClient {
  createProject(request: CreateProjectRequest): Promise<CreateProjectResponse>;
  saveProject(request: SaveProjectRequest): Promise<SaveProjectResponse>;
  getProjects(request: GetProjectsRequest): Promise<GetProjectsResponse>;
}

export class ProjectApiClient implements IProjectApiClient {
  async getProjects(request: GetProjectsRequest): Promise<GetProjectsResponse> {
    const params = new URLSearchParams();

    if (request.userId) {
      params.set('userId', request.userId);
    }
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/projects?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to get projects');
    }

    return (await response.json()) as GetProjectsResponse;
  }

  async createProject(
    request: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        cache: 'no-cache',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to save project');
    }

    return (await response.json()) as CreateProjectResponse;
  }

  async saveProject(request: SaveProjectRequest): Promise<SaveProjectResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${request.projectId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to update project');
    }

    return (await response.json()) as SaveProjectResponse;
  }
}
