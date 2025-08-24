'use server';
import 'reflect-metadata';

import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Asset } from '@/features/assets/types';
import type { IProjectRepository, ProjectEditing } from '@/features/projects';
import { Token, withTransactionScope } from '@/lib/di';

export async function fetchProjectEditing(
  projectId: string,
): Promise<ProjectEditing> {
  return await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const storage = scope.resolve<IAssetStorageService>(
      Token.AssetStorageService,
    );

    const project = await repository.getById(projectId);
    const assetIds = project.assetIds.map((e) => e.value);
    const assets = await storage.downloads(assetIds);

    return {
      id: project.id.value,
      workspace: project.workspaceJson.value,
      assets: assets.map<Asset>((e) => ({
        id: e.id.value,
        name: e.name.value,
        path: e.path.value,
      })),
    };
  });
}
