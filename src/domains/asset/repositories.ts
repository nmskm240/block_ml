import { Asset } from './entities';

export interface IAssetRepository {
  findById(id: string): Promise<Asset | undefined>;
  findByIds(ids: string[]): Promise<Asset[]>;
  save(asset: Asset): Promise<Asset>;
}
