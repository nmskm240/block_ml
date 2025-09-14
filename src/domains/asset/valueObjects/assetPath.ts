import path from 'path';

import { DomainValidationError } from '@/domains/errors';

export class AssetPath {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new AssetPathEmptyError();
    }
    if (trimmed.includes('..') || path.isAbsolute(trimmed)) {
      throw new AssetPathAbsoluteError();
    }

    this.value = trimmed;
  }

  equals(other: AssetPath): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class AssetPathEmptyError extends DomainValidationError {
  constructor() {
    super('Asset path must not be empty.');
  }
}

export class AssetPathAbsoluteError extends DomainValidationError {
  constructor() {
    super('Asset path must not be absolute');
  }
}
