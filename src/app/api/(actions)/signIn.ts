'use server';

import 'reflect-metadata';
import { signIn as NextAuthSignIn } from '@/lib/nextAuth/auth';
import { SignInSchema } from '@/features/users/schemas';
import type { SignInParams } from '@/features/users/schemas';
import { ServerActionResult } from '@/types';
import { AuthError } from 'next-auth';

export default async function signIn(
  values: SignInParams
): Promise<ServerActionResult> {
  const parsed = SignInSchema.safeParse(values);
  if (!parsed.success) {
    return {
      isSuccess: false,
      error: {
        message: 'Invalid input',
      },
    };
  }

  const { email, password } = parsed.data;
  try {
    await NextAuthSignIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });

    return {
      isSuccess: true,
      message: 'Login success',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            isSuccess: false,
            error: {
              message: 'Faild to email or password',
            },
          };
        default:
          return {
            isSuccess: false,
            error: {
              message: 'Faild login',
            },
          };
      }
    }

    throw error;
  }
}
