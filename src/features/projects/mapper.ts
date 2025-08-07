import {
  ProjectAsset as ProjectAssetEntity,
  Project as ProjectEntity,
  UserProject as UserProjectEntity,
} from '@/lib/prisma';
import Project, { ProjectStatus } from './domains';
import { ProjectEntityInput } from './types';

export function toDomain(entity: {
  project: ProjectEntity;
  userProject: UserProjectEntity;
  projectAssets: ProjectAssetEntity[];
}): Project {
  return Project.empty().copyWith({
    id: entity.project.id,
    title: entity.project.title,
    workspaceJson: JSON.stringify(entity.project.workspaceJson),
    ownerUserId: entity.userProject.userId,
    status: ProjectStatus.from(entity.project.status),
    assetIds: entity.projectAssets.map((e) => e.assetId),
    updatedAt: entity.project.updatedAt,
  });
}

export function toEntity(model: Project): {
  project: ProjectEntityInput;
  userProject: UserProjectEntity;
  projectAssets: ProjectAssetEntity[];
} {
  if (!model.id || !model.ownerUserId) {
    throw new Error();
  }

  return {
    project: {
      id: model.id,
      title: model.title,
      workspaceJson: model.workspaceJson,
      status: model.status,
    },
    userProject: {
      projectId: model.id,
      userId: model.ownerUserId,
    },
    projectAssets: model.assetIds.map((e) => ({
      projectId: model.id!,
      assetId: e.value,
      deleteFlag: false,
    })),
  };
}
