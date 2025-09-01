'use server';

import '@/lib/di/registry';
import 'reflect-metadata';

import { signIn as NextAuthSignIn } from '@/lib/nextAuth';

import { SignInParams, SignInSchema } from './types';

export default async function signIn(values: SignInParams) {
  const { email, password } = SignInSchema.parse(values);
  await NextAuthSignIn('credentials', {
    email,
    password,
    redirectTo: '/',
  });
}
