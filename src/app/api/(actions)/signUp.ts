'use server';

import User from '@/features/users/domains';
import { IUserRepository, UserRepository } from '@/features/users/repositories';
import type { SignUpParams } from '@/features/users/schemas';
import { SignUpSchema } from '@/features/users/schemas';
import { withTransaction } from '@/lib/di/container';
import { prisma } from '@/lib/prisma/prisma';
import { ServerActionResult } from '@/types';
import bcrypt from 'bcrypt';
import 'reflect-metadata';

export async function signUp(
  values: SignUpParams,
): Promise<ServerActionResult> {
  return await prisma.$transaction(async (tx) => {
    const container = withTransaction(tx);
    const parsed = SignUpSchema.safeParse(values);
    if (!parsed.success) {
      return {
        isSuccess: false,
        error: {
          message: 'Invalid input',
        },
      };
    }
    const { name, email, password } = parsed.data;
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.new(name, email, hashedPassword);

    await repository.create(user);
    return {
      isSuccess: true,
      message: 'User created successfully',
    };
  });
}
