'use server';
import '@/lib/di/registry';
import 'reflect-metadata';

import { IAssetStorage } from '@/domains/asset';
import { Token, withTransactionScope } from '@/lib/di';
import { ProjectAssetInfo, ProjectInfo, ProjectQueryService } from '@/services';

export async function loadProject(projectId: string): Promise<ProjectInfo> {
  return await withTransactionScope(async (scope) => {
    const query = scope.resolve<ProjectQueryService>(Token.ProjectQueryService);
    const storage = scope.resolve<IAssetStorage>(Token.AssetStorage);
    const metadata = await query.fetchProjectMetadata(projectId);
    const files = await storage.downloads(metadata.assets.map((e) => e.id));

    return {
      ...metadata,
      assets: metadata.assets.map<ProjectAssetInfo>((e, index) => ({
        ...e,
        file: files[index],
      })),
    };
  });
}
