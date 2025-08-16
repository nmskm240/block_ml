import User from '../domains';
import { IUserRepository } from '../repositories';

export default class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  constructor(initialUsers: User[] = []) {
    this.users = initialUsers;
  }

  async create(user: User): Promise<User> {
    // IDが設定されていない場合は生成
    const newUser = user.copyWith({ id: user.id ?? 'new-id-' + (this.users.length + 1) });
    this.users.push(newUser);
    return newUser;
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === userId);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.users.some((u) => u.email === email);
  }

  // テスト用のヘルパーメソッド
  clear() {
    this.users = [];
  }

  add(user: User) {
    this.users.push(user);
  }
}
