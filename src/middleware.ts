/* eslint-disable consistent-return */
import type { NextRequest } from 'next/server';
import { decrypt } from './app/services/encryption';
import { IUser } from './Model/User';

async function getUser(req: NextRequest) {
  try {
    const token = (await req.cookies.get('user')?.value) as string;
    const currentUser = await decrypt(token);

    return currentUser;
  } catch (error) {
    return undefined;
  }
}

export async function middleware(request: NextRequest) {
  const currentUser: IUser = await getUser(request);
  const path = request.nextUrl.pathname;

  // TODO: Redirect to /login instead after implementing login page
  if (!currentUser && !(request.nextUrl.pathname === '/')) {
    return Response.redirect(new URL('/', request.url));
  }

  // Ignore middleware for sys-admins
  if (currentUser && currentUser.roles.sysAdmin) {
    return;
  }

  // Prevents users from accessing the dashboard if they are not logged in
  if (currentUser && !path.startsWith('/dashboard')) {
    return Response.redirect(new URL('/dashboard', request.url));
  }

  // Prevent users from accessing kog page if they are not a kog member
  if (currentUser && !currentUser.roles.KOG && path.startsWith('/dashboard/kog')) {
    return Response.redirect(new URL('/dashboard', request.url));
  }

  // Prevent users from accessing kt page if they are not a kt member
  if (currentUser && !currentUser.roles.KT && path.startsWith('/dashboard/kt')) {
    return Response.redirect(new URL('/dashboard', request.url));
  }

  // Prevent users from accessing admin pages if they are not an admin
  if (currentUser && !currentUser.roles.admin && path.startsWith('/dashboard/admin')) {
    return Response.redirect(new URL('/dashboard', request.url));
  }

  // Prevent admins from accessing CS pages if they are not a CS
  if (currentUser && !currentUser.roles.cs && path.startsWith('/dashboard/admin/manage')) {
    return Response.redirect(new URL('/dashboard', request.url), 403);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
