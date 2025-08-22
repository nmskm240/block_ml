import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Asset } from '@/features/assets/types';
import { withTransactionScope } from '@/lib/di/container';
import { Token } from '@/lib/di/types';
import type { IProjectRepository } from '../repositories';
import { ProjectEditing } from '../types';

export default async function fetchProjectEditing(
  projectId: string
): Promise<ProjectEditing> {
  return await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IProjectRepository>(
      Token.ProjectRepository
    );
    const storage = scope.resolve<IAssetStorageService>(
      Token.AssetStorageService
    );

    const project = await repository.findById(projectId);
    if (!project) {
      // FIXME: 本来はgetByIdでRepositoy側が投げるべき例外だと思う
      throw new Error('Project not found');
    }

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
