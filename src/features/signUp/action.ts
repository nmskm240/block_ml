'use server';

import '@/lib/di/registry';
import 'reflect-metadata';

import { User, IUserRepository } from '@/domains/user';
import { Token, withTransactionScope } from '@/lib/di';

import { UserAlreadySignUpEmailError } from './errors';
import { SignUpParams, SignUpSchema } from './types';

export async function signUp(params: SignUpParams) {
  const { name, email, password } = SignUpSchema.parse(params);
  return await withTransactionScope(async (scope) => {
    const repository = scope.resolve<IUserRepository>(Token.UserRepository);
    const exists = await repository.existsByEmail(email);

    if (exists) {
      throw new UserAlreadySignUpEmailError(email);
    }

    const user = User.new({ name, email, password });
    await repository.create(user);
  });
}
