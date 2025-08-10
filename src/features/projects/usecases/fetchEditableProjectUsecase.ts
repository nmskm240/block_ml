import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import type { IAssetRepository } from '@/features/assets/repositories';
import type { IProjectRepository } from '../repositories';
import { Token } from '@/lib/di/types';

@injectable()
export default class FetchEditableProjectUsecase {
  constructor(
    @inject(Token.ProjectRepository)
    private readonly _projectRepository: IProjectRepository,
    @inject(Token.AssetRepository)
    private readonly _assetRepository: IAssetRepository
  ) {}

  async execute(
    projectId: string,
    userId: string
  ): Promise<{ projectJson: string; projectAssetUrls: string[] }> {
    const project = await this._projectRepository.findProjectById(projectId);
    if (!project || !project.isEdittable(userId)) {
      throw new Error('Project not found or not editable');
    }

    const assets = await Promise.all(
      project.assetIds.map((id) => this._assetRepository.findById(id.value))
    );

    return {
      projectJson: project.workspaceJson.value,
      projectAssetUrls: assets
        .filter((asset) => asset)
        .map((asset) => asset!.path.value),
    };
  }
}
