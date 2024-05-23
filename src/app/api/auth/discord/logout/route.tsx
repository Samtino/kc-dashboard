import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    cookies().delete('user');

    const url = `${process.env.ADDRESS}:${process.env.PORT}/`;
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ message: 'Logout Failed' }, { status: 500 });
  }
}
