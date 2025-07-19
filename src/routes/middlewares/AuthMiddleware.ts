import { type unstable_MiddlewareFunction } from 'react-router';
import { redirect } from 'react-router-dom';
import { AuthService } from '../../services';

const AuthMiddleware: unstable_MiddlewareFunction = async ({ request }) => {
  const session = await AuthService.getSession();
  const url = new URL(request.url);
  const inLoginPage = url.pathname === '/login';

  if (!session && inLoginPage) {
    return redirect('/login');
  }
  if (session && inLoginPage) {
    throw redirect('/');
  }
};

export default AuthMiddleware;
