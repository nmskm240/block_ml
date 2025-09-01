import { DomainValidationError } from '@/domains/errors';

const LIMIT_LENGTH = 500;

export class ProjectDescription {
  constructor(readonly value: string) {
    if (value.length > LIMIT_LENGTH) {
      throw new ProjectDescriptionTooLongError();
    }

    this.value = value;
  }

  equals(other: ProjectDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class ProjectDescriptionTooLongError extends DomainValidationError {
  constructor() {
    super(`Project description must be ${LIMIT_LENGTH} characters or less.`);
  }
}
