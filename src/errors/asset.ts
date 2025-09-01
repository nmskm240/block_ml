export class AssetNotFoundError extends Error {
  constructor(assetId: string) {
    super(`Asset not found. id: ${assetId}`);
  }
}
