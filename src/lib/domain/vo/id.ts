/* eslint-disable @typescript-eslint/no-explicit-any */
import { isCuid } from '@paralleldrive/cuid2';

export abstract class Id<T extends Id<any>> {
  constructor(readonly value: string) {
    if (!isCuid(value)) {
      throw new Error('Invalid CUID');
    }
  }

  toString() {
    return this.value;
  }

  equals(other: T): boolean {
    return (
      other instanceof Id &&
      this.constructor === other.constructor &&
      this.value === other.value
    );
  }
}
