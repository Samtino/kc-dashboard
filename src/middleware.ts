import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './services/encryption';
import { UserData } from '@/lib/types';

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('user');
  const userData = cookie ? ((await decrypt(cookie.value)) as UserData) : undefined;
  const user = userData?.user;
  const path = request.nextUrl.pathname;

  const baseUrl = request.nextUrl.origin; // Construct base URL

  if (path === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', baseUrl));
    }

    return NextResponse.next();
  }

  if (!user && !path.startsWith('/')) {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL('/', baseUrl));
  }

  if (user.roles.includes('SYS_ADMIN')) {
    // FIXME: this doesn't work
    return NextResponse.next();
  }

  if (path.startsWith('/dashboard')) {
    if (user.roles.includes('KOG') && path.startsWith('/dashboard/kog')) {
      return NextResponse.next();
    }
    if (user.roles.includes('KT') && path.startsWith('/dashboard/kt')) {
      return NextResponse.next();
    }
    if (user.roles.includes('ADMIN') || user.roles.includes('COMMUNITY_STAFF')) {
      if (path.startsWith('/dashboard/admin/manage') && user.roles.includes('COMMUNITY_STAFF')) {
        return NextResponse.next();
      }
      if (path.startsWith('/dashboard/admin')) {
        return NextResponse.next();
      }
    } else if (path === '/dashboard') {
      return NextResponse.next();
    } else {
      return NextResponse.json({ error: 'No access' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
