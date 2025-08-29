import { createId } from '@paralleldrive/cuid2';

import { ProjectId } from '../projectId';

it('should be a valid CUID', () => {
  const projectId = new ProjectId(createId());
  expect(projectId.value).toMatch(/^[a-z0-9]{24,}$/);
});
