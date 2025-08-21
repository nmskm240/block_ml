import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetEditingProjectResponse,
  GetProjectsRequest,
  GetProjectsResponse,
  SaveProjectRequest,
  SaveProjectRequestSchema,
  SaveProjectResponse,
} from './types';

export interface IProjectApiClient {
  createProject(request: CreateProjectRequest): Promise<CreateProjectResponse>;
  saveProject(
    projectId: string,
    request: SaveProjectRequest
  ): Promise<SaveProjectResponse>;
  // FIXME: searchでは?
  getProjectSummaries(
    request: GetProjectsRequest
  ): Promise<GetProjectsResponse>;
  getEditingProject(projectId: string): Promise<GetEditingProjectResponse>;
}

export class ProjectApiClient implements IProjectApiClient {
  async getProjectSummaries(
    request: GetProjectsRequest
  ): Promise<GetProjectsResponse> {
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
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to save project');
    }

    return (await response.json()) as CreateProjectResponse;
  }

  async saveProject(
    projectId: string,
    request: SaveProjectRequest
  ): Promise<SaveProjectResponse> {
    const parsed = await SaveProjectRequestSchema.safeParseAsync(request);
    if (!parsed.success) {
      throw new Error();
    }
    const data = new FormData();
    data.append('projectJson', parsed.data.projectJson!.toString());
    for (const file of parsed.data.assets ?? []) {
      data.append('assets', file);
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/edit`,
      {
        method: 'PUT',
        body: data,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to update project');
    }

    return (await response.json()) as SaveProjectResponse;
  }

  async getEditingProject(
    projectId: string
  ): Promise<GetEditingProjectResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}/edit`,
      { method: 'GET', credentials: 'include' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return (await response.json()) as GetEditingProjectResponse;
  }
}
