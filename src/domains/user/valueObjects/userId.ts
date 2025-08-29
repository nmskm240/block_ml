import { createId } from '@paralleldrive/cuid2';

import { Id } from '@/lib/domain/vo';

export class UserId extends Id<UserId> {
  static generate(): UserId {
    return new UserId(createId());
  }
}
