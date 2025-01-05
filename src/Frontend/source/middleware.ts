import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const pathname = req.nextUrl.pathname;
  if (
    (!token || token.value === '') &&
    pathname !== '/auth/login' &&
    pathname !== '/auth/signup' &&
    pathname !== '/2fa/login-2fa' &&
    pathname !== '/2fa/signup-2fa'
  ) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl.origin));
  }

  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/home', req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
    '/games',
    '/friends',
    '/profile',
    '/auth/login',
    '/auth/signup',
    '/2fa/login-2fa',
  ],
};
