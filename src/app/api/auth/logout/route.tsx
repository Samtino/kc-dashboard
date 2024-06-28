import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    cookies().delete('user');

    // FIXME: This should be a redirect to the homepage
    // FIXME: replace this with a server action rather than a route
    const url = `${process.env.ADDRESS}:${process.env.PORT}/`;
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ message: 'Logout Failed' }, { status: 500 });
  }
}
