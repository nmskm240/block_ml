import User from '@/features/users/domains';
import { IUserRepository } from '@/features/users/repositories';
import { withTransactionScope } from '@/lib/di/container';
import { Token } from '@/lib/di/types';
import { IProjectRepository } from '../repositories';
import { ProjectSearchQuery, ProjectSummary } from '../types';

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
    // FIXME: UserId.equalsで比較できるようにするべき？
    const ownerUser = users.find((u) => u.id === project.ownerUserId!.value)!;
    return {
      id: project.id.value,
      title: project.title.value,
      description: 'comming soon', // TODO: 後でやる
      status: project.status,
      createdBy: {
        id: ownerUser.id ?? "", // FIXME: UserIdの取り廻しは見直したほうがいいかもしれない
        name: ownerUser.name,
        avatarUrl: '', // TODO: 後でやる
      },
      updatedAt: project.updatedAt,
    };
  });
}
