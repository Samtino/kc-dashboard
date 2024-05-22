import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET() {
  if (await cookies().has('user')) {
    return redirect('/dashboard');
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI as string);
  const scopes = ['identify', 'guilds.members.read'];

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join('+')}`;

  return NextResponse.redirect(discordAuthUrl);
}
