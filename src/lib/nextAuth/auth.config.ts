import {
  AuthService,
  IAuthService,
} from '@/features/users/services/authService';
import { SignInSchema } from '@/features/users/types';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import 'reflect-metadata';
import container from '@/lib/di/container';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validated = SignInSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }
        const { email, password } = validated.data;
        const service = container.resolve<IAuthService>(AuthService);
        const verificated = await service.verify(email, password);

        if (!verificated) {
          return null;
        }

        return {
          id: verificated.id,
          name: verificated.name,
          email: verificated.email,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
