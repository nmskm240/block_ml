import "reflect-metadata";
import { inject, injectable } from 'tsyringe';
import type { IProjectRepository } from '../repositories';
import type { IAssetStorageService } from '@/features/assets/services/assetStorageService';
import { Token } from "@/lib/di/types";

@injectable()
export default class UpdateProjectUsecase {
  constructor(
    @inject(Token.ProjectRepository)
    private readonly _projectRepository: IProjectRepository,
    @inject(Token.AssetStorageService)
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

    if (project.ownerUserId?.value !== userId) {
      throw new Error('Permission denied');
    }

    const uploadedAssets = await this._storageService.upload(input.assets);
    project.edit(
      input.json,
      uploadedAssets.map((asset) => asset.id.value)
    );
    await this._projectRepository.updateProject(project);
  }
}
