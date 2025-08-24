import 'reflect-metadata';
import { createId } from '@paralleldrive/cuid2';

import { Asset, AssetId } from '@/features/assets';
import { MockFile } from '@/lib/jest/__mocks__/file';

describe('constructor', () => {
  it('should create an asset instance with valid params', () => {
    const params = {
      id: createId(),
      name: 'test',
      path: 'test/hoge',
    };
    const asset = new Asset(params);
    expect(asset.id.value).toBe(params.id);
    expect(asset.name.value).toBe(params.name);
    expect(asset.path.value).toBe(params.path);
  });
});

describe('from', () => {
  it('should create an Asset from a File object', () => {
    const mockFile = new MockFile('new-file.csv', 'test');
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
    expect(() => new Asset({ ...baseParams, name: ' ' })).toThrow(
      'Asset name must not be empty.',
    );
  });

  it('should throw error if name is over 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => new Asset({ ...baseParams, name: longName })).toThrow(
      'Asset name must be 100 characters or less.',
    );
  });

  it('should trim the name', () => {
    const asset = new Asset({ ...baseParams, name: '  trimmed-name.jpg  ' });
    expect(asset.name.value).toBe('trimmed-name.jpg');
  });
});

describe('AssetPath (ValueObject)', () => {
  it('should throw error if path is empty', () => {
    expect(() => new Asset({ ...baseParams, path: ' ' })).toThrow(
      'Asset path must not be empty.',
    );
  });

  it('should throw error for invalid paths containing ".."', () => {
    const invalidPath = '../some/path';
    expect(() => new Asset({ ...baseParams, path: invalidPath })).toThrow(
      `Invalid asset path: "${invalidPath}"`,
    );
  });

  it('should throw error for absolute paths', () => {
    const invalidPath = '/absolute/path';
    expect(() => new Asset({ ...baseParams, path: invalidPath })).toThrow(
      `Invalid asset path: "${invalidPath}"`,
    );
  });
});

describe('AssetId (ValueObject)', () => {
  it('should generate a valid CUID', () => {
    const assetId = AssetId.generate();
    // CUIDの基本的な形式をチェック（ここでは単純な正規表現）
    expect(assetId.value).toMatch(/^[a-z0-9]{24,}$/);
  });
});
