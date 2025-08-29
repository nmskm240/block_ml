'use server';
import '@/lib/di/registry';
import 'reflect-metadata';

import { IAssetStorage } from '@/domains/asset';
import { IProjectRepository } from '@/domains/project';
import { Token, withTransactionScope } from '@/lib/di';
import { ProjectEditing } from '@/services';

export async function fetchProjectEditing(
  projectId: string,
): Promise<ProjectEditing> {
  return await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const storage = scope.resolve<IAssetStorage>(Token.AssetStorage);

    const project = await repository.getById(projectId);
    const assetIds = project.assetIds.map((e) => e.value);
    const assets = await storage.downloads(assetIds);

    return {
      id: project.id.value,
      workspace: project.workspace.value,
      assets: assets,
    };
  });
}

export async function updateProject(
  userId: string,
  input: { id: string; json: string; assets: File[] },
) {
  await withTransactionScope(async (container) => {
    const repository = container.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const storage = container.resolve<IAssetStorage>(Token.AssetStorage);

    const project = await repository.getById(input.id);
    if (!project.isEditableBy(userId)) {
      throw new Error('Permission denied');
    }

    const uploadedAssets = await storage.uploads(input.assets);
    project.edit(
      input.json,
      uploadedAssets.map((asset) => asset.id.value),
    );
    await repository.update(project);
  });
}
