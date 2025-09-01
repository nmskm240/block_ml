import { DomainValidationError } from '@/domains/errors';

export class ProjectWorkspace {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new ProjectWorkspaceEmptyError();
    }

    this.value = trimmed;
  }

  equals(other: ProjectWorkspace): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class ProjectWorkspaceEmptyError extends DomainValidationError {
  constructor() {
    super('Project workspace must not be empty.');
  }
}
