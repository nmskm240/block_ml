import {User} from './entities';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(userId: string): Promise<User | undefined>;
  getById(userId: string): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  existsByEmail(email: string): Promise<boolean>;
  update(user: User): Promise<User>;
}
