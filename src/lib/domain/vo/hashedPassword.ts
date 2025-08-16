import { hashSync } from 'bcryptjs';

export class HashedPassword {
  constructor(readonly value: string) {
    if (!/^\$2[aby]\$/.test(value)) {
      throw new Error('Invalid hashed pasword');
    }
  }

  static fromRaw(value: string, saltRound?: number): HashedPassword {
    if (!value) {
      throw new Error('Password must not be empty.');
    }
    saltRound ??= process.env.HASH_SALT_ROUND
      ? parseInt(process.env.HASH_SALT_ROUND)
      : 10;
    const hashed = hashSync(value, saltRound);
    return new HashedPassword(hashed);
  }

  equals(other: HashedPassword): boolean {
    return this.value === other.value;
  }
}
