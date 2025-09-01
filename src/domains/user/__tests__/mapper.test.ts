import { createId } from '@paralleldrive/cuid2';
import { User as UserEntity } from '@prisma/client';

import { User } from '../entities';
import { toDomain, toEntity } from '../mapper';
import { UserStatus } from '../valueObjects';

describe('toDomain', () => {
  it('should map a UserEntity to a User domain object', () => {
    const entity: UserEntity = {
      id: createId(),
      name: 'Entity User',
      email: 'entity@example.com',
      emailVerified: null,
      password: '$2a$10$abcdefghijklmnopqrstuvwxy.abcdefghijkl',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const domain = toDomain(entity);

    expect(domain).toBeInstanceOf(User);
    expect(domain.id.value).toBe(entity.id);
    expect(domain.name.value).toBe(entity.name);
    expect(domain.email.value).toBe(entity.email);
    expect(domain.hashedPassword.value).toMatch(/^\$2[aby]\$/); // ハッシュ形式であることを確認
    expect(domain.status).toBe(UserStatus.Active); // User.newでActiveになるため
  });
});

describe('toEntity', () => {
  it('should map a User domain object to a UserEntity (partial)', () => {
    const domain = User.new({
      name: 'Domain User',
      email: 'domain@example.com',
      password: 'plain_password',
    });

    const entity = toEntity(domain);

    expect(entity.id).toBe(domain.id.value);
    expect(entity.name).toBe(domain.name.value);
    expect(entity.email).toBe(domain.email.value);
    expect(entity.password).toBe(domain.hashedPassword.value);
  });
});
