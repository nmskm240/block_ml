import { ProjectEntity } from '@/lib/prisma/client';

export type ProjectEntityInput = Partial<
  Omit<ProjectEntity, 'createdAt' | 'updatedAt' | 'statusUpdatedAt'>
>;

export interface ProjectSummaryDto {
  id: string;
  title: string;
  updatedAt: Date;
}
