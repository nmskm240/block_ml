import { PrismaClient } from '@/lib/prisma';
import { makeOption } from '@/lib/nextAuth/options';
import { getServerSession, NextAuthOptions, Session, User } from 'next-auth';
import { injectable } from 'tsyringe';

export interface IAuthService {
  get options(): NextAuthOptions;
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
}

@injectable()
export class AuthService implements IAuthService {
  private readonly _options: NextAuthOptions;

  constructor(prisma: PrismaClient) {
    this._options = makeOption(prisma);
  }

  get options(): NextAuthOptions {
    return this._options;
  }

  async getSession() {
    return await getServerSession(this._options);
  }

  async getUser() {
    const session = await this.getSession();
    return {
      id: session?.user.id,
      name: session?.user.name,
      email: session?.user.email,
      image: session?.user.image,
    } as User;
  }
}
