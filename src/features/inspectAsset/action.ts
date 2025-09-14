'use server';

import { IAssetStorage } from '@/domains/asset';
import { Token, withTransactionScope } from '@/lib/di';

export async function fetchAssetFiles(...assetIds: string[]) {
  return await withTransactionScope(async (scope) => {
    const storage = scope.resolve<IAssetStorage>(Token.AssetStorage);
    return await storage.downloads(assetIds);
  });
}
