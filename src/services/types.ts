import { z } from 'zod';

export const AssetInfoSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const ProjectAssetInfoSchema = AssetInfoSchema.extend({
  file: z.instanceof(File),
});

export type ProjectAssetInfo = z.infer<typeof ProjectAssetInfoSchema>;

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
  assets: z.array(AssetInfoSchema),
  updatedAt: z.date(),
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

export const ProjectMetadataSchema = ProjectSummarySchema.extend({
  workspace: z.json(),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;

export const ProjectInfoSchema = ProjectMetadataSchema.extend({
  assets: z.array(ProjectAssetInfoSchema),
});

export type ProjectInfo = z.infer<typeof ProjectInfoSchema>;

export const ProjectSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  userId: z.cuid2().optional(),
  limit: z.int().min(0).optional(),
  offset: z.int().min(0).optional(),
});

export type ProjectSearchQuery = z.infer<typeof ProjectSearchQuerySchema>;
