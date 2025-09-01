import {
  ProjectAsset as ProjectAssetEntity,
  Project as ProjectEntity,
  UserProject as UserProjectEntity,
} from '@prisma/client';

import { Project } from './entities';
import { fromProjectStatus } from './valueObjects';

type ProjectEntitySet = {
  project: Omit<ProjectEntity, 'createdAt' | 'updatedAt' | 'statusUpdatedAt'>;
  userProject: UserProjectEntity;
  projectAssets: ProjectAssetEntity[];
};

export function toDomain(entity: ProjectEntitySet): Project {
  return new Project({
    id: entity.project.id,
    title: entity.project.title,
    description: entity.project.description,
    workspaceJson: JSON.stringify(entity.project.workspaceJson),
    ownerUserId: entity.userProject.userId,
    status: fromProjectStatus(entity.project.status),
    assetIds: entity.projectAssets.map((e) => e.assetId),
  });
}

export function toEntity(model: Project): ProjectEntitySet {
  if (model.isTemporary) {
    throw new Error();
  }

  return {
    project: {
      id: model.id.value,
      title: model.title.value,
      description: model.description.value,
      workspaceJson: model.workspace.value,
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
