import { auth as middleware } from './auth';

const needAuthRoutes: (string | RegExp)[] = [];
const authRoutes: string[] = ['/sign-up', '/sign-in'];
const apiAuthPrefix: string = '/api/auth';
const DEFAULT_LOGIN_REDIRECT: string = '/';

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const requiresAuth = needAuthRoutes.some((pattern) =>
    pattern instanceof RegExp
      ? pattern.test(nextUrl.pathname)
      : nextUrl.pathname === pattern,
  );

  if (isApiAuthRoute) {
    return null;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (requiresAuth && !isLoggedIn) {
    return Response.redirect(new URL('/sign-up', nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
