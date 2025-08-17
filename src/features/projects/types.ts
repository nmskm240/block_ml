import { Project as ProjectEntity } from '@prisma/client';

export type ProjectEntityInput = Omit<
  ProjectEntity,
  'createdAt' | 'updatedAt' | 'statusUpdatedAt'
>;

export interface ProjectSummaryDto {
  id: string;
  title: string;
  updatedAt: Date;
}

