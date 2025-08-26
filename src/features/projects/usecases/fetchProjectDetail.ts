'use server';
import 'reflect-metadata';

import { ProjectDetail } from '@/features/projects';
import { Token, withTransactionScope } from '@/lib/di';

import { ProjectQueryService } from '../services';

export async function fetchProjectDetail(
  projectId: string,
): Promise<ProjectDetail> {
  return await withTransactionScope(async (scope) => {
    const query = scope.resolve<ProjectQueryService>(Token.ProjectQueryService);

    return await query.fetchProjectDetail(projectId);
  });
}
