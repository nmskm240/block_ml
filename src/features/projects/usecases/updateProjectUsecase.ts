import { injectable } from 'tsyringe';
import type { IProjectRepository } from '../repositories';
import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';

@injectable()
export default class UpdateProjectUsecase {
  constructor(
    private readonly _projectRepository: IProjectRepository,
    private readonly _storageService: IAssetStorageService
  ) {}

  async execute(
    userId: string,
    input: { id: string; json: string; assets: File[] }
  ): Promise<void> {
    const project = await this._projectRepository.findProjectById(input.id);
    if (!project) {
      throw new Error('Project not found');
    }

    if(project.ownerUserId !== userId) {
      throw new Error('Permission denied');
    }

    const uploadedAssets = await this._storageService.upload(input.assets);
    const edited = project.copyWith({
      workspaceJson: input.json,
      assetIds: uploadedAssets.map(asset => asset.id),
    });
    await this._projectRepository.updateProject(edited);
  }
}
