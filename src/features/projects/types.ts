import { Project as ProjectEntity } from '@prisma/client';
import z from 'zod';
import { UserInfoSchema } from '../users/types';

export type ProjectEntityInput = Omit<
  ProjectEntity,
  'createdAt' | 'updatedAt' | 'statusUpdatedAt'
>;

export const ProjectSummarySchema = z.object({
  id: z.cuid2(),
  title: z.string().min(1),
  description: z.string(),
  status: z.number(),
  createdBy: UserInfoSchema,
  updatedAt: z.date(),
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

export const ProjectSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  userId: z.cuid2().optional(),
  limit: z.int().min(0).optional(),
  offset: z.int().min(0).optional(),
});

export type ProjectSearchQuery = z.infer<typeof ProjectSearchQuerySchema>;
