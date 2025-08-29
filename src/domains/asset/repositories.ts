import { Asset } from './entities';

export interface IAssetRepository {
  findById(id: string): Promise<Asset | undefined>;
  save(asset: Asset): Promise<Asset>;
}
