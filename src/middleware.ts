import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './services/encryption';
import { UserData } from '@/lib/types';

const PUBLIC_ROUTES = ['/', '/login'];
const PRIVATE_ROUTE_PREFIX = '/dashboard';

export async function middleware(request: NextRequest) {
  // const cookie = request.cookies.get('user');
  // const userData = cookie ? ((await decrypt(cookie.value)) as UserData) : undefined;
  // const user = userData?.user;
  // const path = request.nextUrl.pathname;

  // const baseUrl = request.nextUrl.origin;

  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Check public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the route is private
  if (pathname.startsWith(PRIVATE_ROUTE_PREFIX)) {
    const cookie = request.cookies.get('user');

    if (!cookie) {
      // FIXME: Redirects during login flow
      return NextResponse.next();
    }

    const { user } = (await decrypt(cookie.value)) as UserData;

    if (!user.roles.includes('KOG') && pathname.startsWith('/dashboard/kog')) {
      // If not KOG, redirect to dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (!user.roles.includes('KT') && pathname.startsWith('/dashboard/kt')) {
      // If not KT, redirect to dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (!user.roles.includes('ADMIN') && pathname.startsWith('/dashboard/admin')) {
      // If not ADMIN, redirect to dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (!user.roles.includes('COMMUNITY_STAFF') && pathname.startsWith('/dashboard/cs')) {
      // If not CS, redirect to dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // For any other routes, just proceed
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
