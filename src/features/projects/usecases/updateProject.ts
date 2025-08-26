'use server';
import 'reflect-metadata';

import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import type { IProjectRepository } from '@/features/projects';
import { Token, withTransactionScope } from '@/lib/di';

export async function updateProject(
  userId: string,
  input: { id: string; json: string; assets: File[] },
) {
  await withTransactionScope(async (container) => {
    const repository = container.resolve<IProjectRepository>(
      Token.ProjectRepository,
    );
    const storage = container.resolve<IAssetStorageService>(
      Token.AssetStorageService,
    );

    const project = await repository.getById(input.id);
    if (!project.isEditableBy(userId)) {
      throw new Error('Permission denied');
    }

    const uploadedAssets = await storage.upload(input.assets);
    project.edit(
      input.json,
      uploadedAssets.map((asset) => asset.id.value),
    );
    await repository.update(project);
  });
}
