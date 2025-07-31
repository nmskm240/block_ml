import { ProjectEntity, UserProjectEntity } from '@/lib/prisma';
import { Project } from './domains';
import { ProjectEntityInput } from './types';

export function toDomain(entity: ProjectEntity & UserProjectEntity): Project {
  return Project.empty().copyWith({
    id: entity.id,
    title: entity.title,
    blocklyJson: JSON.stringify(entity.workspaceJson),
    ownerUserId: entity.userId,
  });
}

export function toEntity(model: Project): {
  project: ProjectEntityInput;
  userProject: UserProjectEntity;
} {
  return {
    project: {
      id: model.id ?? '',
      title: model.title,
      workspaceJson: model.blocklyJson ,
      status: model.status,
    },
    userProject: {
      projectId: model.id ?? '',
      userId: model.ownerUserId ?? '',
    },
  };
}
