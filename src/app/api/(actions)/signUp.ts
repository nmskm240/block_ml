'use server';

import User from '@/features/users/domains';
import { IUserRepository, UserRepository } from '@/features/users/repositories';
import type { SignUpParams } from '@/features/users/types';
import { SignUpSchema } from '@/features/users/types';
import { withTransactionScope } from '@/lib/di/container';
import { ServerActionResult } from '@/types';
import 'reflect-metadata';

export async function signUp(
  values: SignUpParams
): Promise<ServerActionResult> {
  const parsed = SignUpSchema.safeParse(values);
  if (!parsed.success) {
    return {
      isSuccess: false,
      error: {
        message: 'Invalid input',
      },
    };
  }
  // TODO: Usecaseとしてまとめる
  const { name, email, password } = parsed.data;
  return await withTransactionScope(async (container) => {
    const repository = container.resolve<IUserRepository>(UserRepository);
    const exists = await repository.existsByEmail(email);

    if (exists) {
      return {
        isSuccess: false,
        error: {
          message: 'User already exists',
        },
      };
    }

    const user = User.new({ name, email, password });

    await repository.create(user);
    return {
      isSuccess: true,
      message: 'User created successfully',
    };
  });
}
