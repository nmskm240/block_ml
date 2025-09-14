import {
  AssetName,
  AssetNameEmptyError,
  AssetNameTooLongError,
} from '../assetName';

it('should create an AssetName', () => {
  const name = new AssetName('test-name');
  expect(name).toBeInstanceOf(AssetName);
  expect(name.value).toBe('test-name');
});

it('should trim the name', () => {
  const name = new AssetName('  test-name  ');
  expect(name.value).toBe('test-name');
});

it('should throw error if name is empty', () => {
  expect(() => new AssetName('')).toThrow(AssetNameEmptyError);
  expect(() => new AssetName('   ')).toThrow(AssetNameEmptyError);
});

it('should throw error if name is too long', () => {
  const longName = 'a'.repeat(101);
  expect(() => new AssetName(longName)).toThrow(AssetNameTooLongError);
});

it('should compare two AssetNames', () => {
  const name1 = new AssetName('test-name');
  const name2 = new AssetName('test-name');
  const name3 = new AssetName('another-name');

  expect(name1.equals(name2)).toBe(true);
  expect(name1.equals(name3)).toBe(false);
});
