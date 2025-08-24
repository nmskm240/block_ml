'use server';
import 'reflect-metadata';

import {
  IProjectRepository,
  ProjectSearchQuery,
  ProjectSummary,
} from '@/features/projects';
import User from '@/features/users/domains';
import { IUserRepository } from '@/features/users/repositories';
import { Token, withTransactionScope } from '@/lib/di';

export async function searchProjectSumamries(
  query: ProjectSearchQuery
): Promise<ProjectSummary[]> {
  const { projects, users } = await withTransactionScope(async (container) => {
    const projectRepository = container.resolve<IProjectRepository>(
      Token.ProjectRepository
    );
    const userRepository = container.resolve<IUserRepository>(
      Token.UserRepository
    );
    const projects = await projectRepository.search(query);
    const userIds = projects
      .map((p) => p.ownerUserId?.value)
      .filter((id): id is string => !!id);
    const users = (
      await Promise.all(
        userIds.map((userId) => userRepository.findById(userId))
      )
    ).filter((user): user is User => !!user);

    return { projects, users };
  });

  return projects.map((project) => {
    const ownerUser = users.find((u) => u.id.equals(project.ownerUserId!))!;
    return {
      id: project.id.value,
      title: project.title.value,
      description: 'comming soon', // TODO: 後でやる
      status: project.status,
      createdBy: {
        id: ownerUser.id.value ?? '', // FIXME: UserIdの取り廻しは見直したほうがいいかもしれない
        name: ownerUser.name.value,
        avatarUrl: '', // TODO: 後でやる
      },
      updatedAt: project.updatedAt,
    };
  });
}
