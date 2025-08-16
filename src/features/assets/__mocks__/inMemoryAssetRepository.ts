import Asset from '../domains';
import { IAssetRepository } from '../repositories';

export default class InMemoryAssetRepository implements IAssetRepository {
  private _assets: Asset[] = [];

  constructor(initialAssets: Asset[] = []) {
    this._assets = initialAssets;
  }

  get assets(): ReadonlyArray<Asset> {
    return this._assets;
  }

  async findById(id: string): Promise<Asset | undefined> {
    return this._assets.find((a) => a.id.value === id);
  }

  async save(asset: Asset): Promise<Asset> {
    const index = this._assets.findIndex((a) => a.id.value === asset.id.value);
    if (index !== -1) {
      this._assets[index] = asset;
    } else {
      this._assets.push(asset);
    }
    return asset;
  }

  // テスト用のヘルパーメソッド
  clear() {
    this._assets = [];
  }

  add(asset: Asset) {
    this._assets.push(asset);
  }
}
