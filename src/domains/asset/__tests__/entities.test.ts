import { Asset } from '../entities';
import { AssetId } from '../valueObjects';

it('should create an asset from a file', () => {
  const file = new File([''], 'test.txt');
  const asset = Asset.from(file);

  expect(asset).toBeInstanceOf(Asset);
  expect(asset.name.value).toBe('test.txt');
  expect(asset.path.value).toBe(asset.id.value);
});

it('should move the asset to a new path', () => {
  const asset = new Asset({
    id: AssetId.generate().value,
    name: 'test-name',
    path: 'test-path',
  });
  asset.move('new-path');
  expect(asset.path.value).toBe('new-path');
});
