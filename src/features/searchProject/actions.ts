'use server';

import { Token, withTransactionScope } from '@/lib/di';
import {
  ProjectQueryService,
  ProjectSearchQuery,
  ProjectSummary,
} from '@/services';

export async function searchProject(
  query: ProjectSearchQuery,
): Promise<ProjectSummary[]> {
  return await withTransactionScope(async (scope) => {
    const service = scope.resolve<ProjectQueryService>(
      Token.ProjectQueryService,
    );

    return await service.search(query);
  });
}
