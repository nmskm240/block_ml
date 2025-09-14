import { signIn as NextAuthSignIn } from '@/lib/nextAuth';

import signIn from '../action';
import { SignInParams } from '../types';

const mockedSignIn = NextAuthSignIn as jest.Mock;

describe('signIn action', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
  });

  it('should call NextAuthSignIn with credentials on valid input', async () => {
    const params: SignInParams = {
      email: 'test@example.com',
      password: 'password123',
    };

    await signIn(params);

    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: params.email,
      password: params.password,
      redirectTo: '/',
    });
  });

  it('should throw zod error with invalid email', async () => {
    const params = {
      email: 'invalid-email',
      password: 'password123',
    } as SignInParams;
    await expect(signIn(params)).rejects.toThrow();
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('should throw zod error with a short password', async () => {
    const params = {
      email: 'test@example.com',
      password: 'short',
    } as SignInParams;
    await expect(signIn(params)).rejects.toThrow();
    expect(mockedSignIn).not.toHaveBeenCalled();
  });
});
