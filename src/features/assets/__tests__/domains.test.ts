import Asset, { AssetId } from '../domains';
import { createId } from '@paralleldrive/cuid2';

// Fileオブジェクトのモック
const createMockFile = (name: string, content = 'test content') => {
  const blob = new Blob([content]);
  return new File([blob], name);
};

describe('Asset', () => {
  const baseParams = {
    id: createId(),
    name: 'test-asset.txt',
    path: 'assets/test-asset.txt',
  };

  describe('constructor', () => {
    it('should create an asset instance with valid params', () => {
      const asset = new Asset(baseParams);
      expect(asset.id.value).toBe(baseParams.id);
      expect(asset.name.value).toBe(baseParams.name);
      expect(asset.path.value).toBe(baseParams.path);
    });
  });

  describe('from', () => {
    it('should create an Asset from a File object', () => {
      const mockFile = createMockFile('new-file.csv');
      const asset = Asset.from(mockFile);

      expect(asset).toBeInstanceOf(Asset);
      expect(asset.name.value).toBe('new-file.csv');
      // fromメソッドでは、pathにidと同じ値が設定される
      expect(asset.path.value).toBe(asset.id.value);
    });
  });

  describe('move', () => {
    it('should update the asset path', () => {
      const asset = new Asset(baseParams);
      const newPath = 'new/path/to/asset.txt';
      asset.move(newPath);
      expect(asset.path.value).toBe(newPath);
    });
  });

  describe('AssetName (ValueObject)', () => {
    it('should throw error if name is empty', () => {
      expect(() => new Asset({ ...baseParams, name: ' ' })).toThrow('Asset name must not be empty.');
    });

    it('should throw error if name is over 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(() => new Asset({ ...baseParams, name: longName })).toThrow('Asset name must be 100 characters or less.');
    });

    it('should trim the name', () => {
      const asset = new Asset({ ...baseParams, name: '  trimmed-name.jpg  ' });
      expect(asset.name.value).toBe('trimmed-name.jpg');
    });
  });

  describe('AssetPath (ValueObject)', () => {
    it('should throw error if path is empty', () => {
      expect(() => new Asset({ ...baseParams, path: ' ' })).toThrow('Asset path must not be empty.');
    });

    it('should throw error for invalid paths containing ".."', () => {
      const invalidPath = '../some/path';
      expect(() => new Asset({ ...baseParams, path: invalidPath })).toThrow(`Invalid asset path: "${invalidPath}"`);
    });

    it('should throw error for absolute paths', () => {
      const invalidPath = '/absolute/path';
      expect(() => new Asset({ ...baseParams, path: invalidPath })).toThrow(`Invalid asset path: "${invalidPath}"`);
    });
  });

  describe('AssetId (ValueObject)', () => {
    it('should generate a valid CUID', () => {
        const assetId = AssetId.generate();
        // CUIDの基本的な形式をチェック（ここでは単純な正規表現）
        expect(assetId.value).toMatch(/^[a-z0-9]{24,}$/);
    });
  });
});
