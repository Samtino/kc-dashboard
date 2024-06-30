import { NextRequest, NextResponse } from 'next/server';
import { discordCallback } from '@/src/services/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=NoCodeProvided', request.url));
  }

  const user = await discordCallback(code);

  if (!user) {
    return NextResponse.redirect(new URL('/?error=FailedToLogin', request.url));
  }

  return NextResponse.redirect('/dashboard');
}
