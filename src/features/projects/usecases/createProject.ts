'use server';
import 'reflect-metadata';

import { IProjectRepository } from '@/features/projects';
import { Token, withTransactionScope } from '@/lib/di';
import { auth } from '@/lib/nextAuth';

export async function createProject() {
  const session = await auth();
  await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository
    );
  });
}
