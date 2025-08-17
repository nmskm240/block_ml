import type { IProjectRepository } from '../repositories';
import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Token } from '@/lib/di/types';
import { withTransactionScope } from '@/lib/di/container';

export async function updateProject(
  userId: string,
  input: { id: string; json: string; assets: File[] }
) {
  await withTransactionScope(async (container) => {
    const repository = container.resolve<IProjectRepository>(
      Token.ProjectRepository
    );
    const storage = container.resolve<IAssetStorageService>(
      Token.AssetStorageService
    );

    const project = await repository.findProjectById(input.id);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.ownerUserId?.value !== userId) {
      throw new Error('Permission denied');
    }

    const uploadedAssets = await storage.upload(input.assets);
    project.edit(
      input.json,
      uploadedAssets.map((asset) => asset.id.value)
    );
    await repository.updateProject(project);
  });
}
