import { DomainValidationError } from '@/domains/errors';

const LIMIT_LENGTH = 100;

export class AssetName {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new AssetNameEmptyError();
    }
    if (trimmed.length > 100) {
      throw new AssetNameTooLongError();
    }

    this.value = trimmed;
  }

  equals(other: AssetName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class AssetNameEmptyError extends DomainValidationError {
  constructor() {
    super('Asset name must not be empty.');
  }
}

export class AssetNameTooLongError extends DomainValidationError {
  constructor() {
    super(`Asset name must be ${LIMIT_LENGTH} characters or less.`);
  }
}
