import { StorageClient } from '@supabase/storage-js';
import { inject, injectable } from 'tsyringe';

import { Asset, type IAssetRepository } from '@/features/assets';
import { Token } from '@/lib/di/types';

const BUCKET_NAME: string = 'assets';

export interface IAssetStorageService {
  upload(files: File[]): Promise<Asset[]>;
  downloads(ids: string[]): Promise<Asset[]>;
}

@injectable()
export class AssetStorageService implements IAssetStorageService {
  constructor(
    @inject(Token.SupabaseStorageClient)
    private readonly _client: StorageClient,
    @inject(Token.AssetRepository)
    private readonly _repository: IAssetRepository,
  ) {}

  // FIXME: アップロードしたファイルに毎回新しいIDが割り当てられるためゴミが溜まりやすい
  async upload(files: File[]): Promise<Asset[]> {
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

  async downloads(ids: string[]): Promise<Asset[]> {
    const assets: Asset[] = [];
    for (const id of ids) {
      const asset = await this._repository.findById(id);
      if (!asset) {
        continue;
      }

      const { data, error } = await this._client
        .from(BUCKET_NAME)
        .createSignedUrl(asset.path.value, 60);
      if (error || !data?.signedUrl) {
        throw new Error(`Failed to create signed URL for ${id}`);
      }

      asset.move(data.signedUrl);
      assets.push(asset);
    }

    return assets;
  }
}
