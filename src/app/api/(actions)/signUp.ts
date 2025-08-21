'use server';

import User from '@/features/users/domains';
import { IUserRepository } from '@/features/users/repositories';
import { IUserService } from '@/features/users/services/userService';
import { withTransactionScope } from '@/lib/di/container';
import { Token } from '@/lib/di/types';
import z from 'zod';

export default async function signUp(values: SignUpParams) {
  const { name, email, password } = SignUpSchema.parse(values);
  await withTransactionScope(async (container) => {
    const service = container.resolve<IUserService>(Token.UserService);
    const repository = container.resolve<IUserRepository>(Token.UserRepository);
    const exists = await service.isExist(email);

    if (exists) {
      throw new UserAlreadyExistsError(email);
    }

    const user = User.new({ name, email, password });
    await repository.create(user);
  });
}

export const SignUpSchema = z.object({
  name: z.string().min(1, 'User name is required'),
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpParams = z.infer<typeof SignUpSchema>;

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} is already registered`);
  }
}
