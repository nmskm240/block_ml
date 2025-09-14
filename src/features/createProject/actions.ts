'use server';
import '@/lib/di/registry';
import 'reflect-metadata';

import { IProjectRepository, Project } from '@/domains/project';
import { Token, withTransactionScope } from '@/lib/di';
import { auth } from '@/lib/nextAuth';

export async function createProject(): Promise<{ projectId: string }> {
  const session = await auth();
  const project = await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const newProject = Project.empty(session?.user?.id);
    return await repository.create(newProject);
  });
  return { projectId: project.id.value };
}
