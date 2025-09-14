import { DomainValidationError } from '@/domains/errors';

const LIMIT_LENGTH = 100;

export class ProjectTitle {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new ProjectTitleEmptyError();
    }
    if (trimmed.length > LIMIT_LENGTH) {
      throw new ProjectTitleTooLongError();
    }

    this.value = trimmed;
  }

  equals(other: ProjectTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class ProjectTitleEmptyError extends DomainValidationError {
  constructor() {
    super('Project title must not be empty.');
  }
}

export class ProjectTitleTooLongError extends DomainValidationError {
  constructor() {
    super(`Project title must be ${LIMIT_LENGTH} characters or less.`);
  }
}
