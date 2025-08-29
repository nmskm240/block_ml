import { createId } from '@paralleldrive/cuid2';

import { Id } from '@/lib/domain/vo';

export class AssetId extends Id<AssetId> {
  static generate(): AssetId {
    return new AssetId(createId());
  }
}
