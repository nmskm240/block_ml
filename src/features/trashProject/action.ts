'use server';

import '@/lib/di/registry';
import 'reflect-metadata';

import { IProjectRepository } from '@/domains/project';
import { ProjectStatus } from '@/domains/project/valueObjects';
import { ForbiddenError, UnauthorizedError } from '@/errors';
import { Token, withTransactionScope } from '@/lib/di';
import { auth } from '@/lib/nextAuth';

export async function trashProject(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const project = await repository.getById(projectId);

    if (!project.isEditableBy(userId)) {
      throw new ForbiddenError();
    }

    project.changeStatus(ProjectStatus.Trashed);
    await repository.update(project);
  });
}
