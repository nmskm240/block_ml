import { createId } from "@paralleldrive/cuid2";

import { Id } from "@/lib/domain/vo";

export class ProjectId extends Id<ProjectId> {
  static generate(): ProjectId {
    return new ProjectId(createId());
  }
}
