import { IAssetStorageService } from '../services/assetStorageService';
import Asset from '../domains';
import { createId } from '@paralleldrive/cuid2';

export class InMemoryAssetStorageService implements IAssetStorageService {
  private assets: Asset[] = [];
  public uploadedFiles: File[] = [];

  async upload(files: File[]): Promise<Asset[]> {
    this.uploadedFiles.push(...files);
    const newAssets = files.map(
      (file) =>
        new Asset({
          id: createId(),
          name: file.name,
          path: `path/to/${file.name}`,
        })
    );
    this.assets.push(...newAssets);
    return Promise.resolve(newAssets);
  }

  async downloads(
    assetIds: string[]
  ): Promise<Asset[]> {
    // このテストでは使わないので、空の配列を返す
    return Promise.resolve([]);
  }

  // テスト用のヘルパーメソッド
  clear() {
    this.assets = [];
    this.uploadedFiles = [];
  }

  // テスト用にアセットを追加するヘルパーメソッド
  add(assets: Asset[]) {
    this.assets.push(...assets);
  }
}
