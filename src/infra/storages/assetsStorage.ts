import { StorageClient } from '@supabase/storage-js';
import { inject, injectable } from 'tsyringe';

import { Asset, type IAssetRepository, IAssetStorage } from '@/domains/asset';
import { AssetNotFoundError } from '@/errors';
import { Token } from '@/lib/di/types';

const BUCKET_NAME: string = 'assets';

@injectable()
export class AssetStorage implements IAssetStorage {
  constructor(
    @inject(Token.SupabaseStorageClient)
    private readonly _client: StorageClient,
    @inject(Token.AssetRepository)
    private readonly _repository: IAssetRepository,
  ) {}

  // FIXME: アップロードしたファイルに毎回新しいIDが割り当てられるためゴミが溜まりやすい
  async uploads(files: File[]): Promise<Asset[]> {
    const uploaded: Asset[] = [];

    for (const file of files) {
      const asset = Asset.from(file);
      const { error } = await this._client
        .from(BUCKET_NAME)
        .upload(asset.path.value, file, {
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      const saved = await this._repository.save(asset);
      uploaded.push(saved);
    }

    return uploaded;
  }

  async downloads(ids: string[]): Promise<File[]> {
    return await Promise.all(
      ids.map(async (id) => {
        const asset = await this._repository.findById(id);
        if (!asset) {
          throw new AssetNotFoundError(id);
        }

        const { data, error } = await this._client
          .from(BUCKET_NAME)
          .createSignedUrl(asset.path.value, 60);
        if (error || !data?.signedUrl) {
          throw new Error(`Failed to create signed URL for ${id}`);
        }

        const res = await fetch(data.signedUrl);
        if (!res.ok) {
          throw new Error(`Failed to fetch file from URL: ${data.signedUrl}`);
        }

        const blob = await res.blob();
        return new File([blob], asset.name.value, { type: blob.type });
      }),
    );
  }
}
