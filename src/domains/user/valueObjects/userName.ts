import { DomainValidationError } from '@/domains/errors';

const LIMIT_LENGTH = 100;

export class UserName {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new UserNameEmptyError();
    }
    if (trimmed.length > 100) {
      throw new UserNameTooLongError();
    }
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class UserNameEmptyError extends DomainValidationError {
  constructor() {
    super('User name must not be empty.');
  }
}

export class UserNameTooLongError extends DomainValidationError {
  constructor() {
    super(`User name must be ${LIMIT_LENGTH} characters or less.`);
  }
}
