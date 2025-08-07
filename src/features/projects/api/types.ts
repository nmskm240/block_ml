import { ProjectSummaryDto } from '../types';
import { z } from 'zod';

export interface CreateProjectRequest {}

export interface CreateProjectResponse {
  projectId?: string;
}

export const SaveProjectRequestSchema = z.object({
  projectJson: z.json(),
});

export type SaveProjectRequest = z.infer<typeof SaveProjectRequestSchema>;

export type SaveProjectResponse = {};

export interface GetProjectsRequest {
  userId?: string;
}

export interface GetProjectsResponse {
  projectSummaries: ProjectSummaryDto[];
}
