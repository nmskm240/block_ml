'use server';

import 'reflect-metadata';
import z from 'zod';

import { User, IUserRepository } from '@/features/users';
import { Token, withTransactionScope } from '@/lib/di';

export async function signUp(params: SignUpParams) {
  const { name, email, password } = SignUpSchema.parse(params);
  return await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IUserRepository>(Token.UserRepository);
    const exists = await repository.existsByEmail(email);

    if (exists) {
      throw new UserAlreadySignUpEmailError();
    }

    const user = User.new({ name, email, password });
    await repository.create(user);
  });
}

//#region schema

export const SignUpSchema = z.object({
  name: z.string().min(1, 'User name is required'),
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpParams = z.infer<typeof SignUpSchema>;

//#endregion

//#region errors

export class UserAlreadySignUpEmailError extends Error {}

//#endregion
