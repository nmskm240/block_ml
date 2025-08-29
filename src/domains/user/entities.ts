import { Email, HashedPassword } from '@/lib/domain/vo';

import { UserId, UserName, UserStatus } from './valueObjects';

type UserParams = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  status: UserStatus;
};

export class User {
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
