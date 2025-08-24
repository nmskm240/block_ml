import { createId } from '@paralleldrive/cuid2';

import { Email, HashedPassword, Id } from '@/lib/domain/vo';

type UserParams = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  status: UserStatus;
};

export default class User {
  public readonly id: UserId;
  private _name: UserName;
  private _email: Email;
  private _password: HashedPassword;
  private _status: UserStatus;
  private _image?: string | null;

  constructor(params: UserParams) {
    this.id = new UserId(params.id);
    this._name = new UserName(params.name);
    this._email = new Email(params.email);
    this._password = new HashedPassword(params.hashedPassword);
    this._status = params.status;
    this._image = "";
  }

  static new(p: { name: string; email: string; password: string }): User {
    return new User({
      id: UserId.generate().value,
      name: p.name,
      email: p.email,
      hashedPassword: HashedPassword.fromRaw(p.password).value,
      status: UserStatus.Active,
    });
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get hashedPassword() {
    return this._password;
  }

  get status() {
    return this._status;
  }

  get image() {
    return this._image;
  }

  changePassword(password: string) {
    this._password = HashedPassword.fromRaw(password);
  }

  edit(editted: { name?: string; email?: string }) {
    if (editted.name) this._name = new UserName(editted.name);
    if (editted.email) this._email = new Email(editted.email);
  }

  updateImage(imageUrl: string | null) {
    this._image = imageUrl;
  }
}

export enum UserStatus {
  None = 0,
  Active = 1,
  Deleted = 2,
}

//#region valueObjects

export class UserId extends Id<UserId> {
  static generate(): UserId {
    return new UserId(createId());
  }
}

export class UserName {
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
