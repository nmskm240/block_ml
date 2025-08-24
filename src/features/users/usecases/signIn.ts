'use server';

import 'reflect-metadata';

import { SignInParams, SignInSchema } from '@/features/users';
import { signIn as NextAuthSignIn } from '@/lib/nextAuth/auth';

export default async function signIn(values: SignInParams) {
  const { email, password } = SignInSchema.parse(values);
  await NextAuthSignIn('credentials', {
    email,
    password,
    redirectTo: '/',
  });
}
