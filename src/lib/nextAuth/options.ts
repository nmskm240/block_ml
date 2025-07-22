import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@/lib/prisma';

export const makeOption = (client: PrismaClient): NextAuthOptions => {
  return {
    adapter: PrismaAdapter(client),
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await client.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return user;
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        if (token) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};
