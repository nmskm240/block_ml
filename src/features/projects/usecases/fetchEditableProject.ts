import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Asset } from '@/features/assets/types';
import { Token } from '@/lib/di/types';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import type { IProjectRepository } from '../repositories';
import { withTransactionScope } from '@/lib/di/container';

@injectable()
export default class FetchEditableProjectUsecase {
  constructor(
    @inject(Token.ProjectRepository)
    private readonly _projectRepository: IProjectRepository,
    @inject(Token.AssetStorageService)
    private readonly _storageService: IAssetStorageService
  ) {}

  async execute(
    projectId: string,
    userId: string
  ): Promise<{ projectJson: string; projectAssets: Asset[] }> {
    const project = await this._projectRepository.findById(projectId);
    if (!project || !project.isEdittable(userId)) {
      throw new Error('Project not found or not editable');
    }

    const assets = await this._storageService.downloads(
      project.assetIds.map((e) => e.value)
    );

    return {
      projectJson: project.workspaceJson.value,
      projectAssets: assets
        .filter((asset) => asset !== undefined)
        .map((asset) => ({
          id: asset?.id.value,
          name: asset?.name.value,
          path: asset?.path.value,
        })),
    };
  }
}


