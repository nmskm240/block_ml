export class Id {
  constructor(readonly value: string) {
    if (!value.match(/^c[a-z0-9]{24}$/)) {
      throw new Error('Invalid CUID');
    }
  }

  toString() {
    return this.value;
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }
}

export class ProjectId extends Id {}
export class UserId extends Id {}
