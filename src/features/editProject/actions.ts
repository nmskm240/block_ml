'use server';
import '@/lib/di/registry';
import 'reflect-metadata';

import { IAssetStorage } from '@/domains/asset';
import { IProjectRepository } from '@/domains/project';
import { Token, withTransactionScope } from '@/lib/di';
import { auth } from '@/lib/nextAuth';


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
