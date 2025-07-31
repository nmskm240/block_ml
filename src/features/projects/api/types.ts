import { Project } from "../domains";

export interface CreateProjectRequest {}

export interface CreateProjectResponse {
  project: Project;
}

export interface SaveProjectRequest {
  projectId: string;
  project: Project;
}

export interface SaveProjectResponse {}
