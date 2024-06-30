import { NextRequest, NextResponse } from 'next/server';
import { discordCallback } from '@/src/services/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const baseUrl = request.nextUrl.origin; // Construct base URL

  if (!code) {
    return NextResponse.redirect(new URL('/?error=NoCodeProvided', baseUrl));
  }

  const user = await discordCallback(code);

  if (!user) {
    return NextResponse.redirect(new URL('/?error=FailedToLogin', baseUrl));
  }

  return NextResponse.redirect(new URL('/dashboard', baseUrl));
}
