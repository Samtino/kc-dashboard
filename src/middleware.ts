// /* eslint-disable consistent-return */
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './services/encryption';
import { UserData } from '@/lib/types';

export async function middleware(request: NextRequest) {
  const cookie = await request.cookies.get('user');
  const { user }: UserData = cookie ? await decrypt(cookie.value) : undefined;
  const path = request.nextUrl.pathname;

  if (path === '/') {
    if (!user) {
      // TODO: Redirect to /login instead after implementing login page
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user.roles.includes('SYS_ADMIN')) {
    return NextResponse.next();
  }

  if (path.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  if (user.roles.includes('KOG') && path.startsWith('/dashboard/kog')) {
    return NextResponse.next();
  }

  if (user.roles.includes('KT') && path.startsWith('/dashboard/kt')) {
    return NextResponse.next();
  }

  if (user.roles.includes('ADMIN' || 'COMMUNITY_STAFF') && path.startsWith('/dashboard/admin')) {
    return NextResponse.next();
  }

  if (user.roles.includes('COMMUNITY_STAFF') && path.startsWith('/dashboard/admin/manage')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
