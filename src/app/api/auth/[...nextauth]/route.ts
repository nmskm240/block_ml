import NextAuth from 'next-auth';
import container from '@/app/api/container';
import { AuthService, IAuthService } from '@/features/auth/services/AuthService';

const authService = container.resolve<IAuthService>(AuthService);
const handler = NextAuth(authService.options);

export { handler as GET, handler as POST };
