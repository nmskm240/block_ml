import {
  AssetPath,
  AssetPathAbsoluteError,
  AssetPathEmptyError,
} from '../assetPath';

it('should create an AssetPath', () => {
  const path = new AssetPath('test-path');
  expect(path).toBeInstanceOf(AssetPath);
  expect(path.value).toBe('test-path');
});

it('should trim the path', () => {
  const path = new AssetPath('  test-path  ');
  expect(path.value).toBe('test-path');
});

it('should throw error if path is empty', () => {
  expect(() => new AssetPath('')).toThrow(AssetPathEmptyError);
  expect(() => new AssetPath('   ')).toThrow(AssetPathEmptyError);
});

it('should throw error for invalid path (..)', () => {
  expect(() => new AssetPath('../test')).toThrow(AssetPathAbsoluteError);
});

it('should throw error for invalid path (absolute)', () => {
  expect(() => new AssetPath('/test')).toThrow(AssetPathAbsoluteError);
});

it('should compare two AssetPaths', () => {
  const path1 = new AssetPath('test-path');
  const path2 = new AssetPath('test-path');
  const path3 = new AssetPath('another-path');

  expect(path1.equals(path2)).toBe(true);
  expect(path1.equals(path3)).toBe(false);
});
