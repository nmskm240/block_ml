import { ProjectSummary, UserProfile } from '@/types/app';

export interface PostProjectRequest {}

export interface PostProjectResponse {
  projectId: string;
  blocklyJson?: string;
  files: File[];
}

export interface PutProjectRequest {
  projectId: string;
  blocklyJson: string;
  files: File[];
}

export interface PutProjectResponse {}

export interface GetProjectRequest {}

export interface GetProjectResponse {
  projectId: string;
  blocklyJson: { [key: string]: any };
  files: File[];
}

export type ProjectRouteParams = {
  id: string;
};

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  profile: UserProfile;
  projectSummaries: ProjectSummary[];
}

export type UserRouteParams = {
  userId: string;
};
