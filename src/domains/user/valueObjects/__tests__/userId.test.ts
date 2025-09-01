import { createId } from '@paralleldrive/cuid2';

import { UserId } from '../userId';

it('should be a valid CUID', () => {
  const userId = new UserId(createId());
  expect(userId.value).toMatch(/^[a-z0-9]{24,}$/);
});
