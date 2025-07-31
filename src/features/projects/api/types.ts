import { Project } from '../domains';
import { ProjectSummaryDto } from '../types';

export interface CreateProjectRequest {}

export interface CreateProjectResponse {
  project: Project;
}

export interface SaveProjectRequest {
  projectId: string;
  project: Project;
}

export interface SaveProjectResponse {}

export interface GetProjectsRequest {
  userId?: string;
}

export interface GetProjectsResponse {
  projects: ProjectSummaryDto[];
}
