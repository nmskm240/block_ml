'use server';

import { signIn as NextAuthSignIn } from '@/lib/nextAuth/auth';
import z from 'zod';

export default async function signIn(values: SignInParams) {
  const { email, password } = SignInSchema.parse(values);
  await NextAuthSignIn('credentials', {
    email,
    password,
    redirectTo: '/',
  });
}

export const SignInSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInParams = z.infer<typeof SignInSchema>;
