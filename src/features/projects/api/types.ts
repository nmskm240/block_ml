import { AssetSchema } from '@/features/assets/types';
import { ProjectSummaryDto } from '../types';
import { z } from 'zod';

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
  projectSummaries: ProjectSummaryDto[];
}

export const GetEditingProjectResponseSchema = z.object({
  projectJson: z.json(),
  assets: z.array(AssetSchema)
});

export type GetEditingProjectResponse = z.infer<typeof GetEditingProjectResponseSchema>;
