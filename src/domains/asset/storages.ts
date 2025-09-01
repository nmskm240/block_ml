import { Asset } from '@/domains/asset/entities';

export interface IAssetStorage {
  uploads(files: File[]): Promise<Asset[]>;
  downloads(ids: string[]): Promise<File[]>;
}
