import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const allowedModes = new Set(['one-vs-one', 'one-vs-one-local']);
  const allowedMaps = new Set(['air', 'fire', 'earth', 'water']);
  const pathname = req.nextUrl.pathname;
  if (
    (!token || token.value === '') &&
    pathname !== '/auth/login' &&
    pathname !== '/auth/signup' &&
    pathname !== '/2fa/login-2fa'
  ) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl.origin));
  }

  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/home', req.nextUrl.origin));
  }

  if (pathname === '/Game-Arena' && !allowedModes.has(req.nextUrl.searchParams.get('mode') || "")) {
    return NextResponse.redirect(new URL('/games', req.nextUrl.origin));
  }

  if ((pathname === '/Game-Arena' || pathname === '/tournament') && !allowedMaps.has(req.nextUrl.searchParams.get('map') || "")) {
    return NextResponse.redirect(new URL(`/games?mode=${req.nextUrl.searchParams.get('mode')}`, req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/achievement',
    '/friends',
    '/games',
    '/home',
    '/LeaderBoard',
    '/MatchHistory',
    '/messages',
    '/messages/:path*', 
    '/Profile',
    '/Profile/:path*', 
    '/profile2fa/activate2Fa',
    '/settings',
    '/tournament',
    '/Game-Arena',
    '/auth/login',
    '/auth/signup',
    '/2fa/login-2fa',
  ],
};
