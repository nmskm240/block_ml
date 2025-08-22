import { z } from 'zod';
import { ProjectEditingSchema, ProjectSummary } from '../types';

export interface CreateProjectRequest {}

export interface CreateProjectResponse {
  projectId?: string;
}

export const SaveProjectRequestSchema = z.object({
  projectJson: z.json(),
  assets: z.array(z.instanceof(File)).optional(),
});

export type SaveProjectRequest = z.infer<typeof SaveProjectRequestSchema>;

export type SaveProjectResponse = {};

export interface GetProjectsRequest {
  userId?: string;
}

export interface GetProjectsResponse {
  projectSummaries: ProjectSummary[];
}

export const GetProjectEditingResponseSchema = ProjectEditingSchema;

export type GetProjectEditingResponse = z.infer<
  typeof GetProjectEditingResponseSchema
>;
