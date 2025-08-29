import { z } from 'zod';

export const AssetInfoSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1),
  path: z.url(),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const UserInfoSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  avatarUrl: z.url(),
});

export type Userinfo = z.infer<typeof UserInfoSchema>;

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

export const ProjectEditingSchema = z.object({
  id: z.cuid2(),
  workspace: z.json(),
  assets: z.array(z.file("")),
});

export type ProjectEditing = z.infer<typeof ProjectEditingSchema>;

export const ProjectDetailSchema = z.object({
  id: z.cuid2(),
  title: z.string(),
  description: z.string(),
  status: z.number(),
  createdBy: UserInfoSchema,
  assets: z.array(AssetInfoSchema),
  updatedAt: z.date(),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
