import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './services/encryption';
import { UserData } from '@/lib/types';

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('user');
  const userData: UserData | undefined = cookie ? await decrypt(cookie.value) : undefined;
  const user = userData?.user;
  const path = request.nextUrl.pathname;

  // Redirect to /dashboard if the user is authenticated and is on the root path
  if (path === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow access to the root path if the user is not authenticated

    return NextResponse.next();
  }

  // Redirect to the root path if the user is not authenticated and is trying to access a protected route
  if (!user && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Sys-admins can bypass all checks
  if (user && user.roles.includes('SYS_ADMIN')) {
    return NextResponse.next();
  }

  // Allow access to /dashboard for authenticated users
  if (user && path.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Allow access to specific roles for specific paths
  if (user && user.roles.includes('KOG') && path.startsWith('/dashboard/kog')) {
    return NextResponse.next();
  }

  if (user && user.roles.includes('KT') && path.startsWith('/dashboard/kt')) {
    return NextResponse.next();
  }

  if (
    user &&
    (user.roles.includes('ADMIN') || user.roles.includes('COMMUNITY_STAFF')) &&
    path.startsWith('/dashboard/admin')
  ) {
    return NextResponse.next();
  }

  if (
    user &&
    user.roles.includes('COMMUNITY_STAFF') &&
    path.startsWith('/dashboard/admin/manage')
  ) {
    return NextResponse.next();
  }

  // If none of the above conditions are met, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
