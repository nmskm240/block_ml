import { Email } from '@/lib/domain/vo/email';
import { HashedPassword } from '@/lib/domain/vo/hashedPassword';
import Id from '@/lib/domain/vo/Id';
import { createId } from '@paralleldrive/cuid2';

export default class User {
  private _id?: UserId;
  private _name: UserName;
  private _email: Email;
  private _password: HashedPassword;

  constructor(
    name: string,
    email: string,
    password: string,
    readonly status: UserStatus,
    id?: string
  ) {
    this._id = id ? new UserId(id) : UserId.generate();
    this._name = new UserName(name);
    this._email = new Email(email);
    this._password = HashedPassword.fromRaw(password);
  }

  static new(name: string, email: string, password: string): User {
    return new User(name, email, password, UserStatus.Active);
  }

  get id() {
    return this._id?.value;
  }

  get name() {
    return this._name.value;
  }

  get email() {
    return this._email.value;
  }

  get hashedPassword() {
    return this._password.value;
  }

  copyWith(params: Partial<User>): User {
    return new User(
      params.name ?? this.name,
      params.email ?? this.email,
      params.hashedPassword ?? this.hashedPassword,
      params.status ?? this.status,
      params.id ?? this.id
    );
  }
}

export const UserStatus = {
  None: 0,
  Active: 1,
  Deleted: 2,
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

//#region valueObjects

export class UserId extends Id<UserId> {
  static generate(): UserId {
    return new UserId(createId());
  }
}

class UserName {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('User name must not be empty.');
    }
    if (trimmed.length > 100) {
      throw new Error('User name must be 100 characters or less.');
    }
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

//#endregion
