import { User as UserEntity } from '@/lib/prisma';
import User from './domains';

export function toDomain(entity: UserEntity): User {
  return User.new(entity.name!, entity.email!, entity.password!).copyWith({
    id: entity.id,
  });
}

export function toEntity(
  model: User
): Omit<UserEntity, 'createdAt' | 'updatedAt'> {
  return {
    id: model.id!,
    name: model.name,
    email: model.email,
    emailVerified: null,
    password: model.password,
    image: null,
  };
}
