import { redirect } from 'react-router-dom';
import { AuthService } from '../../services';

const AuthMiddleware = async ({ request }: { request: Request }) => {
  const session = await AuthService.getSession();
  const url = new URL(request.url);
  const inLoginPage = url.pathname === '/login';

  if (!session && !inLoginPage) {
    throw redirect('/login');
  }
  if (session && inLoginPage) {
    throw redirect('/');
  }

  return null;
};

export default AuthMiddleware;
