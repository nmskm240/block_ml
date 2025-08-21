import { User as UserEntity } from '@prisma/client';
import User, { UserStatus } from './domains';

export function toDomain(entity: UserEntity): User {
  return new User({
    id: entity.id,
    name: entity.name!,
    email: entity.email!,
    hashedPassword: entity.password!,
    status: UserStatus.Active, // TODO: entityから取る
  });
}

export function toEntity(
  model: User
): Omit<UserEntity, 'createdAt' | 'updatedAt'> {
  return {
    id: model.id.value,
    name: model.name.value,
    email: model.email.value,
    emailVerified: null,
    password: model.hashedPassword.value,
    image: model.image ?? null,
  };
}
