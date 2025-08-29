import { Session } from 'next-auth';

export const { auth, handlers, signIn, signOut } = {
  auth: jest.fn<Promise<Session | null>, []>(),
  handlers: {},
  signIn: jest.fn(),
  signOut: jest.fn(),
};
