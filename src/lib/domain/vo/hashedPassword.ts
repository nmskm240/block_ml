export class HashedPassword {
  constructor(readonly value: string) {
    if (!/^\$2[aby]\$/.test(value)) {
      throw new Error('Invalid password hash');
    }
  }

  equals(other: HashedPassword): boolean {
    return this.value === other.value;
  }
}
