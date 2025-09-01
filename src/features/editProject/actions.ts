'use server';
import '@/lib/di/registry';
import 'reflect-metadata';

import { IAssetRepository, IAssetStorage } from '@/domains/asset';
import { IProjectRepository } from '@/domains/project';
import { Token, withTransactionScope } from '@/lib/di';
import { auth } from '@/lib/nextAuth';
import { ProjectEditing } from '@/services';

export async function fetchProjectEditing(
  projectId: string,
): Promise<ProjectEditing> {
  return await withTransactionScope(async (scope) => {
    const projectRepository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const assetRepository = scope.resolve<IAssetRepository>(
      Token.AssetRepository,
    );
    const storage = scope.resolve<IAssetStorage>(Token.AssetStorage);

    const project = await projectRepository.getById(projectId);
    const assetIds = project.assetIds.map((e) => e.value);

    const assetsPromise = assetRepository.findByIds(assetIds);
    const filesPromise = storage.downloads(assetIds);
    const [assets, files] = await Promise.all([assetsPromise, filesPromise]);

    const loadedAssets = assets.map((asset, index) => ({
      id: asset.id.value,
      name: asset.name.value,
      file: files[index],
    }));

    return {
      id: project.id.value,
      workspace: project.workspace.value,
      assets: loadedAssets,
    };
  });
}

export async function updateProject(input: {
  id: string;
  json: string;
  assets: File[];
}) {
  const session = await auth();
  await withTransactionScope(async (container) => {
    const repository = container.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const storage = container.resolve<IAssetStorage>(Token.AssetStorage);

    const project = await repository.getById(input.id);
    if (!project.isEditableBy(session?.user?.id ?? '')) {
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
