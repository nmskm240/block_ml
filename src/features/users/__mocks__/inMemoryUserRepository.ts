import User from '../domains';
import { IUserRepository } from '../repositories';

export default class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  constructor(initialUsers: User[] = []) {
    this.users = initialUsers;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.users.find((u) => u.id.value === userId);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.value === email);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.users.some((u) => u.email.value === email);
  }

  // テスト用のヘルパーメソッド
  clear() {
    this.users = [];
  }

  add(user: User) {
    this.users.push(user);
  }
}
