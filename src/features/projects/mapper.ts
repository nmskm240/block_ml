import {
  ProjectAsset as ProjectAssetEntity,
  Project as ProjectEntity,
  UserProject as UserProjectEntity,
} from '@prisma/client';
import Project, { ProjectStatus } from './domains';
import { ProjectEntityInput } from './types';

export function toDomain(entity: {
  project: ProjectEntity;
  userProject: UserProjectEntity;
  projectAssets: ProjectAssetEntity[];
}): Project {
  return new Project({
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
  if (model.isTemporary) {
    throw new Error();
  }

  return {
    project: {
      id: model.id.value,
      title: model.title.value,
      workspaceJson: model.workspaceJson.value,
      status: model.status,
    },
    userProject: {
      projectId: model.id.value,
      userId: model.ownerUserId!.value,
    },
    projectAssets: model.assetIds.map((e) => ({
      projectId: model.id.value,
      assetId: e.value,
      deleteFlag: false,
    })),
  };
}
