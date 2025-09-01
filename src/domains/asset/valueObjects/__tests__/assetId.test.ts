import { createId } from '@paralleldrive/cuid2';

import { AssetId } from '../assetId';

it('should generate a new AssetId', () => {
  const id = AssetId.generate();
  expect(id).toBeInstanceOf(AssetId);
  expect(typeof id.value).toBe('string');
  expect(id.value.length).toBeGreaterThan(0);
});

it('should compare two AssetIds', () => {
  const idValue = createId();
  const id1 = new AssetId(idValue);
  const id2 = new AssetId(idValue);
  const id3 = new AssetId(createId());

  expect(id1.equals(id2)).toBe(true);
  expect(id1.equals(id3)).toBe(false);
});
